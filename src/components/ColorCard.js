// gets color, onClick function and style flash for flashing the light
/// if flash exsits, add flash
export default function ColorCard({color, onClick, flash}) {
  return (
    <div
        onClick={onClick}
        className={`colorCard ${color} ${flash ? "flash" : ""}`}
    ></div>
  );
}
