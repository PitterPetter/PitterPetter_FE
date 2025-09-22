import { useNavigate } from "react-router-dom";


export const MyPage = () => {
  const navigation = useNavigate();
  return (
    <div>
      <h1>MyPage</h1>
      <div onClick={() => {navigation("/diary")}}>일기</div>
      <div onClick={() => {navigation("/course")}}>코스</div>
    </div>
  );
};