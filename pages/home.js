import withAuth from "../auth/withAuth";
import { useUser } from "../auth/useUser";
import Drawer from "../components/Drawer";

const Home = () => {
  const { user, logout } = useUser();

  return (
    <div>
      {user?.email && (
        <Drawer>
          <div>
            home
            <div>Email: {user.email}</div>
            <button onClick={() => logout()}>Logout</button>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default withAuth(Home);
