import { register } from "../services/authService.js";
import { login } from "../services/authService.js";
import prisma from "../prisma/client.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await register(email, password, name, role);
    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: { id: user.id, email: user.email, role: user.role },
      });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { token, user } = await login(email, password);

    // Create session only if not already today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingSession = await prisma.userSession.findFirst({
      where: {
        userId: user.id,
        loginTime: {
          gte: todayStart,
        },
      },
    });

    if (!existingSession) {
      await prisma.userSession.create({
        data: {
          userId: user.id,
          loginTime: new Date(),
        },
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(401).json({ message: err.message || "Invalid credentials" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

if (userId) {
  // Find latest session without logoutTime
  const latestSession = await prisma.userSession.findFirst({
    where: {
      userId,
      logoutTime: null,
    },
    orderBy: {
      loginTime: "desc",
    },
  });

  if (latestSession) {
    const logoutTime = new Date();
    const durationMs = logoutTime - latestSession.loginTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    await prisma.userSession.update({
      where: { id: latestSession.id },
      data: {
        logoutTime,
        totalDuration: durationHours,
      },
    });
  }
}


    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Failed to logout" });
  }
};
export const getAllSessions = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sessions = await prisma.userSession.findMany({
      where: {
        loginTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        loginTime: "asc",
      },
    });

    const userAggregates = {};

    sessions.forEach((session) => {
      const userId = session.user.id;

      if (!userAggregates[userId]) {
        userAggregates[userId] = {
          user: session.user,
          firstLogin: session.loginTime,
          lastLogout: session.logoutTime || null,
          totalHours: 0,
          isActive: false, // ✅ add default
        };
      }

      // Update first login if earlier
      if (session.loginTime < userAggregates[userId].firstLogin) {
        userAggregates[userId].firstLogin = session.loginTime;
      }

      // Update last logout if later
      if (
        session.logoutTime &&
        (!userAggregates[userId].lastLogout ||
          session.logoutTime > userAggregates[userId].lastLogout)
      ) {
        userAggregates[userId].lastLogout = session.logoutTime;
      }

      // Add total hours
      userAggregates[userId].totalHours += session.totalDuration || 0;

      // ✅ If there is any session with logoutTime null, mark as active
      if (!session.logoutTime) {
        userAggregates[userId].isActive = true;
      }
    });

    const finalData = Object.values(userAggregates);

    res.status(200).json(finalData);
  } catch (err) {
    console.error("Fetch sessions error:", err.message);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};
