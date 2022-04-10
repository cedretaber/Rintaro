import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { StateContext } from "../context";
import { Localisation } from "../domains/mod";

type Props = {
  localisations: Localisation[];
  onItemClick: (localisation: Localisation) => void;
  current?: Localisation;
};

const KeyList: React.FC<Props> = ({ localisations, onItemClick, current }) => {
  const { edit } = React.useContext(StateContext);
  const onClickHandler = React.useCallback(
    (localisation: Localisation) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onItemClick(localisation);
    },
    [onItemClick]
  );
  return (
    <List
      dense
      sx={{ maxHeight: "80vh", overflowX: "auto", overflowY: "auto" }}
    >
      {localisations.map((localisation) => {
        const isEditted = edit.has(localisation.key);
        const isSelected = !!(current && localisation.key === current.key);
        return (
          <ListItem
            key={localisation.key}
            disablePadding
            onClick={onClickHandler(localisation)}
            sx={[
              { paddingLeft: "0.5rem", cursor: "pointer" },
              isEditted
                ? isSelected
                  ? { bgcolor: "rgba(0,66,33,0.18)" }
                  : { bgcolor: "rgba(0,156,99,0.12)" }
                : isSelected
                ? { bgcolor: "rgba(0,0,0,0.12)" }
                : {},
            ]}
          >
            <ListItemText>{localisation.key}</ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};

export default KeyList;
