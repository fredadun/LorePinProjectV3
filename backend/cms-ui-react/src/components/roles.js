import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  Filter
} from 'react-admin';

// Filter component for the role list
const RoleFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <BooleanInput label="System Role" source="isSystem" />
  </Filter>
);

// Role list component
export const RoleList = props => (
  <List filters={<RoleFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <BooleanField source="isSystem" label="System Role" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

// Role edit component
export const RoleEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline />
      <BooleanInput disabled source="isSystem" label="System Role" />
      
      <ArrayInput source="permissions">
        <SimpleFormIterator>
          <TextInput source="resource" validate={required()} />
          <TextInput source="action" validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
      
      <DateInput disabled source="createdAt" />
      <DateInput disabled source="updatedAt" />
    </SimpleForm>
  </Edit>
);

// Role create component
export const RoleCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline />
      <BooleanInput source="isSystem" label="System Role" defaultValue={false} />
      
      <ArrayInput source="permissions">
        <SimpleFormIterator>
          <TextInput source="resource" validate={required()} />
          <TextInput source="action" validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
); 