export function toPlain(doc) {
  const raw = doc.toObject({ versionKey: false });
  const id = raw._id;
  delete raw._id;
  return {
    id: id.toString(),
    ...raw,
  };
}

export function toPlainList(docs) {
  return docs.map((doc) => toPlain(doc));
}


