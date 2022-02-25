import {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Portal from "@andrewthehan/portal";

type Props = {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function useOnKeyPress(
  keyCode: string,
  action: () => void,
  allowInput: boolean = true
) {
  useEffect(() => {
    if (!allowInput) {
      return;
    }

    function keyPressHandler(e: KeyboardEvent) {
      if (e.code === keyCode) {
        action();
      }
    }

    window.addEventListener("keydown", keyPressHandler);

    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [keyCode, action, allowInput]);
}

function Modal({ children, open, setOpen }: Props) {
  useOnKeyPress("Escape", () => setOpen(false), open);

  if (!open) {
    return <Fragment />;
  }

  return (
    <Portal>
      <div
        style={{
          zIndex: 99,
          position: "fixed",
          width: "100vw",
          height: "100vh",
          background: "hsl(0, 0%, 0%, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => setOpen(false)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export default function useModal(
  contentProvider: () => ReactNode
): [() => void, ReactNode, boolean] {
  const [open, setOpen] = useState(false);

  const modal: ReactNode = useMemo(
    () => (
      <Modal open={open} setOpen={setOpen}>
        {contentProvider()}
      </Modal>
    ),
    [open, contentProvider]
  );

  return [() => setOpen(true), modal, open];
}
