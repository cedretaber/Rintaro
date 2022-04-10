import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { Entry, File } from "../domains/mod";
import { StateContext } from "../context";

type Props = {
  onItemClick: (file: File) => void;
};

const FileTree: React.FC<Props> = ({ onItemClick }) => {
  const { mod } = React.useContext(StateContext);
  const hundleClickItem = React.useCallback(
    (file: File) => (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onItemClick(file);
    },
    [onItemClick]
  );
  const dirTree = (entry: Entry, path: string) => {
    const id = `${path}/${entry.name}`;
    if (entry.isFile) {
      return (
        <TreeItem
          key={id}
          nodeId={id}
          label={entry.name}
          onClick={hundleClickItem(entry)}
        />
      );
    } else {
      return (
        <TreeItem key={id} nodeId={id} label={entry.name}>
          {entry.children.map((child) => dirTree(child, id))}
        </TreeItem>
      );
    }
  };
  return mod ? (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        flexGrow: 1,
        height: "95%",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
          height: "0.7rem",
          width: "0.7rem",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "0.5rem",
        },
        "&:hover::-webkit-scrollbar": { display: "inline" },
      }}
    >
      {mod.localisation && dirTree(mod.localisation, "")}
      {mod.localisationSynced && dirTree(mod.localisationSynced, "")}
    </TreeView>
  ) : null;
};

export default React.memo(FileTree);
