import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  ImageField,
  ReferenceField,
  ReferenceInput,
  Filter,
  useRecordContext
} from 'react-admin';

// Custom component to display location
const LocationField = props => {
  const record = useRecordContext();
  if (!record || !record.location) return null;
  
  return (
    <span>
      {record.location.latitude}, {record.location.longitude}
    </span>
  );
};

// Filter component for the challenges
const ChallengeFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput 
      source="status" 
      choices={[
        { id: 'draft', name: 'Draft' },
        { id: 'pending', name: 'Pending Approval' },
        { id: 'active', name: 'Active' },
        { id: 'completed', name: 'Completed' },
        { id: 'rejected', name: 'Rejected' }
      ]} 
    />
    <ReferenceInput source="sponsorId" reference="users">
      <SelectInput optionText="displayName" />
    </ReferenceInput>
    <BooleanInput source="featured" />
  </Filter>
);

// Challenge list component
export const ChallengeList = props => (
  <List filters={<ChallengeFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="status" />
      <ReferenceField source="sponsorId" reference="users">
        <TextField source="displayName" />
      </ReferenceField>
      <LocationField source="location" label="Location" />
      <NumberField source="reward" />
      <BooleanField source="featured" />
      <DateField source="startDate" />
      <DateField source="endDate" />
    </Datagrid>
  </List>
);

// Challenge edit component
export const ChallengeEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <TextInput source="description" multiline fullWidth />
      
      <SelectInput 
        source="status" 
        choices={[
          { id: 'draft', name: 'Draft' },
          { id: 'pending', name: 'Pending Approval' },
          { id: 'active', name: 'Active' },
          { id: 'completed', name: 'Completed' },
          { id: 'rejected', name: 'Rejected' }
        ]} 
      />
      
      <ReferenceInput source="sponsorId" reference="users">
        <SelectInput optionText="displayName" />
      </ReferenceInput>
      
      <NumberInput source="location.latitude" label="Latitude" />
      <NumberInput source="location.longitude" label="Longitude" />
      
      <NumberInput source="reward" />
      <BooleanInput source="featured" />
      
      <DateInput source="startDate" />
      <DateInput source="endDate" />
      
      <ImageField source="imageUrl" title="Challenge Image" />
      <TextInput source="imageUrl" />
      
      <TextInput source="rejectionReason" multiline fullWidth />
      
      <DateInput disabled source="createdAt" />
      <DateInput disabled source="updatedAt" />
    </SimpleForm>
  </Edit>
);

// Challenge create component
export const ChallengeCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" multiline fullWidth />
      
      <SelectInput 
        source="status" 
        choices={[
          { id: 'draft', name: 'Draft' },
          { id: 'pending', name: 'Pending Approval' }
        ]} 
        defaultValue="draft"
      />
      
      <ReferenceInput source="sponsorId" reference="users">
        <SelectInput optionText="displayName" />
      </ReferenceInput>
      
      <NumberInput source="location.latitude" label="Latitude" />
      <NumberInput source="location.longitude" label="Longitude" />
      
      <NumberInput source="reward" />
      <BooleanInput source="featured" defaultValue={false} />
      
      <DateInput source="startDate" />
      <DateInput source="endDate" />
      
      <TextInput source="imageUrl" />
    </SimpleForm>
  </Create>
); 