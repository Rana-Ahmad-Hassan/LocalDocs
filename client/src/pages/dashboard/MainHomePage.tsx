import { useEffect, useState } from "react";
import { DocsHomePage } from "../../components/ui/home/DocsHome";
import { getUserDocs } from "../../services/doc/service";

const MainHome = () => {
  const [userDocs, setUserDocs] = useState<any>([]);

  const fetchUserDocs = async () => {
    try {
      const data = await getUserDocs();
      setUserDocs(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUserDocs();
  }, []);
  return (
    <div>
      <DocsHomePage userDocs={userDocs} />
    </div>
  );
};

export default MainHome;
