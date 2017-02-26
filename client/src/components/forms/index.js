import React from 'react'
import { ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'

export const createInput = (label, type='text') => (field) => (
    <FormGroup controlId={field.input.name}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl {...field.input} type={type} placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
)
