import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  SelectInput,
  required,
  email,
  ReferenceInput,
  ReferenceField,
  Filter
} from 'react-admin';

// Filter component for the user list
const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput source="role" reference="roles">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <BooleanInput label="Active" source="active" />
  </Filter>
);

// User list component
export const UserList = props => (
  <List filters={<UserFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="displayName" label="Name" />
      <EmailField source="email" />
      <ReferenceField source="role" reference="roles">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="active" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

// User edit component
export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="displayName" label="Name" validate={required()} />
      <TextInput source="email" validate={[required(), email()]} />
      <ReferenceInput source="role" reference="roles" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="active" />
      <DateInput disabled source="createdAt" />
      <DateInput disabled source="updatedAt" />
    </SimpleForm>
  </Edit>
);

// User create component
export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="displayName" label="Name" validate={required()} />
      <TextInput source="email" validate={[required(), email()]} />
      <TextInput source="password" type="password" validate={required()} />
      <ReferenceInput source="role" reference="roles" validate={required()}>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="active" defaultValue={true} />
    </SimpleForm>
  </Create>
); 