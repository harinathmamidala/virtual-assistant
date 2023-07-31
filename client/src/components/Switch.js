
const Switch = ({isOn,handleToggle}) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"        
        type="checkbox"
      />
      <label
        style={{ background: isOn &&'#06D6A0'  }}
        className="react-switch-label"
      >
      <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;