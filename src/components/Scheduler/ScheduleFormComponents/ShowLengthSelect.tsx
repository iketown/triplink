import React, { useState, useReducer, Fragment, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  IconButton,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import { FaPlus, FaMinus, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import ShowMe from "../../../utils/ShowMe";

//
//

const initialState = [{ intermission: 0, setLength: 60 }];
const reducer = (state = initialState, action: any) => {
  console.log("action", action);

  switch (action.type) {
    case "ADD_SET": {
      const newState = [...state, { intermission: 15, setLength: 60 }];
      return newState;
    }
    case "CHANGE_SET_MINUTES": {
      const { index, minutes } = action;
      const newState = [...state];
      newState[index] = { ...newState[index], setLength: minutes };
      return newState;
    }
    case "CHANGE_INTERMISSION_MINUTES": {
      const { index, minutes } = action;
      const newState = [...state];
      newState[index] = { ...newState[index], intermission: minutes };
      return newState;
    }
    case "REMOVE_SET": {
      const { index } = action;
      return [...state].filter((_, _index) => _index !== index);
    }
    default:
      return state;
  }
};

const ShowLengthSelect = ({
  onChange,
  savedState
}: {
  onChange: (newSets: any, length: number) => void;
  savedState: any;
}) => {
  const [state, dispatch] = useReducer(reducer, savedState || initialState);
  useEffect(() => {
    const totalLength = state.reduce((sum, set): number => {
      sum += set.setLength;
      sum += set.intermission;
      return sum;
    }, 0);
    onChange(state, totalLength);
  }, [state]);
  const handleAddSet = () => {
    dispatch({ type: "ADD_SET" });
  };
  const handleSetMinutes = (index: number, minutes: number) => {
    dispatch({ type: "CHANGE_SET_MINUTES", index, minutes });
  };
  const handleIntermissionMinutes = (index: number, minutes: number) => {
    dispatch({ type: "CHANGE_INTERMISSION_MINUTES", index, minutes });
  };

  return (
    <>
      <List dense>
        {state.map(({ intermission, setLength }, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 && (
                <ListItem dense>
                  <ShowSet
                    minutes={intermission}
                    index={index}
                    key={index}
                    setMinutes={min => handleIntermissionMinutes(index, min)}
                    isIntermission
                  />
                </ListItem>
              )}
              <ListItem dense>
                <ShowSet
                  minutes={setLength}
                  index={index}
                  key={index}
                  setMinutes={min => handleSetMinutes(index, min)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => dispatch({ type: "REMOVE_SET", index })}
                    color="secondary"
                    size="small"
                  >
                    <FaMinusCircle />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Fragment>
          );
        })}
        <ListItem>
          <ListItemAvatar>
            <IconButton onClick={handleAddSet} size="small">
              <FaPlusCircle />
            </IconButton>
          </ListItemAvatar>
        </ListItem>
      </List>
      {/* <ShowMe obj={state} name="state" /> */}
    </>
  );
};

export default ShowLengthSelect;

interface IShowSet {
  minutes: number;
  index: number;
  setMinutes: (min: number) => void;
  isIntermission?: boolean;
}
const ShowSet = ({ minutes, index, setMinutes, isIntermission }: IShowSet) => {
  return (
    <TextField
      fullWidth
      type="number"
      label={isIntermission ? "intermission" : `set ${index + 1}`}
      value={minutes}
      onChange={e => {
        const num = Number(e.target.value);
        if (typeof num === "number") {
          setMinutes(num);
        }
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">min</InputAdornment>
      }}
    />
  );
};
