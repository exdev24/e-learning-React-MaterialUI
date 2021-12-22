import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import { ExpandMore } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React from 'react';

export default function CollapsibleList<T>(props: {
  items: T[];
  itemRenderer: (t: T, idx: number) => React.ReactNode;
  emptyMessage?: string;
}) {
  if (props.items.length === 0 && props.emptyMessage) {
    return <Alert severity="info">{props.emptyMessage}</Alert>;
  }

  if (props.items.length < 5) {
    return <>{props.items.map(props.itemRenderer)}</>;
  }

  const displayed = props.items.slice(0, 3);
  const hidden = props.items.slice(3);

  return (
    <>
      {displayed.map(props.itemRenderer)}
      <Accordion square>
        <AccordionSummary
          expandIcon={<ExpandMore style={{ color: orange.A700 }} />}
          style={{ color: orange.A700, fontWeight: 'bold' }}
        >
          Expand to show {hidden.length} more classes
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }}>
          {hidden.map(props.itemRenderer)}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
