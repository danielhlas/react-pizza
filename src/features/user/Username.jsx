import {useSelector} from "react-redux";

function Username() {
  const username = useSelector(state => state.user.name)

  return <div className="hidden text-sm font-semibold md:block">{username}</div>;
}

export default Username;
