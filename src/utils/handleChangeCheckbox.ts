//utils/handleChangeCheckbox

export const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, setState: (value:string) => void) => {
  const newValue = event.target.checked ? "انتشار" : "عدم انتشار";
  setState(newValue)

  };
  