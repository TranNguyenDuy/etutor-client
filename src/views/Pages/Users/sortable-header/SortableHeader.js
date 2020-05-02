import React from "react";
import "./sortable-header.module.scss";

export const SortableHeader = (props) => {
  const Direction = {
    asc: <i className="fa fa-caret-up"></i>,
    desc: <i className="fa fa-caret-down"></i>,
  };

  return (
    <div
      className="d-flex clickable"
      onClick={() => {
        if (props.onSort)
          props.onSort(
            props.sortKey,
            props.sort.sortDirection === "asc" ? "desc" : "asc"
          );
      }}
    >
      <span>{props.name}</span>
      {props.sort && props.sort.sortKey === props.sortKey && (
        <div className="sort-direction-container">
          <p className="p-0 m-0">
            &nbsp;
            {Direction[props.sort.sortDirection] || null}
          </p>
        </div>
      )}
    </div>
  );
};
