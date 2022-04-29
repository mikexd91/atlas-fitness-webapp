import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import Drawer from "../components/Drawer";

const Home = () => {
  const { user, logout } = useUser();

  return (
    <div>
      {user?.email && (
        <div>
          trainers
          <div>Email: {user.email}</div>
          <div>id: {user.id}</div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
      <Drawer></Drawer>
    </div>
  );
};

export default withAuth(Home);
