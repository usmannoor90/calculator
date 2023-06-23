import { useReducer } from "react";
import "./style.css";
import DigitButton from "./DigitButton";
import OperandButton from "./OperandButton";

export const ACTIONS = {
  ADD_DIGITS: "add digits",
  CHOOSE_OPERATION: "choose-operations",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGITS: {
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previouseOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previouseOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previouseOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previouseOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previouseOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        previouseOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.CLEAR: {
      return {};
    }
    case ACTIONS.DELETE: {
      if (state.overwrite)
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      if (state.currentOperand == null) {
        return { state };
      }
      if (state.currentOperand.length == 1)
        return {
          ...state,
          currentOperand: null,
        };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    }
  }
}

function evaluate({ currentOperand, previouseOperand, operation }) {
  const prev = parseFloat(previouseOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

// const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
//   maximumFractionDigits: 0,
// });
// function formatOperand(operand) {
//   if (operand == null) return;

//   const [interger, decimal] = operand.splite(".");

//   if (decimal == null) {
//     return INTEGER_FORMATER.format(interger);
//   }
// }
function App() {
  const [{ currentOperand, previouseOperand, operation }, dispatch] =
    useReducer(reducer, {});

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "5rem 0",
      }}
    >
      <div className="calculatorGrid">
        <div className="output">
          <div className="previouse-Operand">
            {previouseOperand}
            {operation}
          </div>
          <div className="next-Operand">{currentOperand}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: "clear" })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
        <OperandButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperandButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperandButton operation="-" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperandButton operation="+" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />

        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
