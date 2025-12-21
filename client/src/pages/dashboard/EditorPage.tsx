import { GoogleDocsEditor } from "../../components/editor/Editor";
import { addColaboratorToDoc } from "../../services/doc/service";

const EditorPage = () => {
  const handleAddColaborator = async (email: string, docId: string) => {
    try {
      const data = await addColaboratorToDoc(email, docId);
      console.log(data);
    } catch (error) {
      throw error;
    }
  };
  return (
    <div>
      <GoogleDocsEditor handleAddColaborator = {handleAddColaborator}/>
    </div>
  );
};

export default EditorPage;
