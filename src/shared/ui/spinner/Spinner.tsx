import { CircularProgress } from "@mui/material";

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <CircularProgress color="secondary" size="30px" />
    </div>
  );
};