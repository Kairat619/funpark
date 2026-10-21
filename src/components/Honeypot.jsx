import React from 'react';

// Hidden spam trap: people never see it, bots tend to fill it in.
// The name is deliberately meaningless so browser autofill leaves it empty.
// Read it on submit with honeypotValue(e).
const FIELD_NAME = 'pf_check';

export const honeypotValue = (e) => e.target.elements[FIELD_NAME]?.value || '';

const Honeypot = () => (
  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
    <input type="text" name={FIELD_NAME} tabIndex={-1} autoComplete="off" defaultValue="" />
  </div>
);

export default Honeypot;
