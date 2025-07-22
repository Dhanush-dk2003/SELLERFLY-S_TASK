// controllers/messageController.js
import prisma from "../prisma/client.js";

// @GET /api/messages
export const getMessages = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const messages = await prisma.permissionRequest.findMany({
      where: {
        OR: [
          { toEmail: userEmail },
          { requestedBy: { email: userEmail } }
        ]
      },
      include: {
        requestedBy: true,
        respondedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = messages.map((msg) => ({
      id: msg.id,
      from: msg.requestedBy.email,
      content: msg.reason,
      timeRange: `${msg.startTime} - ${msg.endTime}`,
      status: msg.status,
    }));

    res.json(result);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

// @POST /api/messages
export const createMessage = async (req, res) => {
  const { to, content, startTime, endTime } = req.body;

  const requests = await Promise.all(
    to.map((toEmail) =>
      prisma.permissionRequest.create({
        data: {
          requestedBy: { connect: { email: req.user.email } },
          toEmail,
          reason: content,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      })
    )
  );

  res.status(201).json({
    id: requests[0].id,
    from: req.user.email,
    content,
    timeRange: `${startTime} - ${endTime}`,
    status: "PENDING",
  });
};


// @DELETE /api/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    await prisma.permissionRequest.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

// @PATCH /api/messages/:id/status
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await prisma.permissionRequest.update({
      where: { id: Number(req.params.id) },
      data: {
        status,
        respondedBy: { connect: { email: req.user.email } },
        updatedAt: new Date(),
      },
    });

    res.json({ success: true, status: updated.status });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
};
