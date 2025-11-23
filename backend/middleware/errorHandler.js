export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(err, _req, res, _next) {
  if (res.headersSent) {
    return;
  }

  const status = typeof err?.status === "number" ? err.status : 500;
  const message =
    typeof err === "object" && err !== null && "message" in err
      ? String(err.message)
      : "Internal server error";

  const stack =
    process.env.NODE_ENV === "production"
      ? undefined
      : typeof err === "object" && err !== null && "stack" in err
        ? String(err.stack)
        : undefined;

  res.status(status).json({
    message,
    stack,
  });
}


