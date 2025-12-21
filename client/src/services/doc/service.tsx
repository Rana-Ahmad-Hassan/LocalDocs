import api from "../../config/api";

export const createDocument = async () => {
  try {
    const response = await api.post(
      "/doc/create",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await api.get(`/doc/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

export const getUserDocs = async () => {
  try {
    const res = await api.get("/doc/user/docs", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addColaboratorToDoc = async (email: string, docId: string) => {
  try {
    const res = await api.post(
      "/doc/add/colaborator",
      {
        email,
        docId,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
