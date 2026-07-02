import styled from "styled-components";

function Switch({ checked, id, onChange }) {
  return (
    <StyledWrapper>
      <div className="container">
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="checkbox"
          checked={checked}
          onChange={onChange}
        />

        <label
          className="switch"
          htmlFor={`checkbox-${id}`}
        >
          <span className="slider" />
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    width: 51px;
    height: 31px;
    position: relative;
  }

  .checkbox {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .switch {
    width: 100%;
    height: 100%;
    display: block;
    background: #e9e9eb;
    border-radius: 16px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: #fff;
    box-shadow:
      0 3px 8px rgba(0, 0, 0, 0.15),
      0 3px 1px rgba(0, 0, 0, 0.06);
    transition: 0.2s ease;
  }

  .checkbox:checked + .switch {
    background: #34c759;
  }

  .checkbox:checked + .switch .slider {
    transform: translateX(20px);
  }
`;

export default Switch;