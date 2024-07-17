import { Button, Steps } from "antd";
import React, { useState } from "react";

const Stepper = () => {
  const [stepperState, setState] = useState(0);
  const [steppersubState, setsubState] = useState(0);

  const handleClick = () => {
    if (stepperState < 3) {
      setState((prevstate) => prevstate + 1);
    }
  };
  const handlesubClick = () => {
    if (stepperState == 2) {
      setsubState((prevstate) => prevstate + 1);
    }
  };

  return (
    <>
      <Steps
        direction="vertical"
        current={stepperState}
        status="error"
        items={[
          {
            title: "In Process",
            description: "This is a description",
          },
          {
            title: "In Process",
            description: "This is a description",
          },
          {
            title: "Waiting",
            description: (
              <>
                <p>This is description</p>

                <Steps
                  progressDot
                  direction="vertical"
                  current={steppersubState}
                  items={[
                    {
                      title: "Finished",
                      description: "This is a description.",
                    },
                    {
                      title: "In Progress",
                      description: "This is a description.",
                    },
                    {
                      title: "Waiting",
                      description: "This is a description.",
                    },
                  ]}
                />
              </>
            ),
          },
        ]}
      />

      <Button onClick={handleClick}>Click</Button>
      <Button onClick={handlesubClick}>Clicksub</Button>
    </>
  );
};

export default Stepper;
