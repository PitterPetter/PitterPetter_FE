import { useNavigate } from "react-router-dom";

export const OptionsPage = () => {
  const navigation = useNavigate();
  return (
    <div>
      <h1>OptionsPage</h1>
      <div onClick={() => {navigation("/recommend")}}>저장하기</div>
    </div>
  );
};


export default OptionsPage;