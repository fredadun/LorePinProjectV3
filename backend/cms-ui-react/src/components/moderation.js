import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ChipField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  SelectInput,
  ImageField,
  ReferenceField,
  Filter,
  BulkDeleteButton,
  BulkExportButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  useRecordContext
} from 'react-admin';

// Custom component to display risk score with color
const RiskScoreField = props => {
  const record = useRecordContext();
  if (!record) return null;
  
  const score = record.riskScore || 0;
  let color = 'green';
  
  if (score >= 80) {
    color = 'red';
  } else if (score >= 50) {
    color = 'orange';
  } else if (score >= 30) {
    color = 'yellow';
  }
  
  return (
    <span style={{ 
      color: 'white', 
      backgroundColor: color, 
      padding: '4px 8px', 
      borderRadius: '4px',
      fontWeight: 'bold'
    }}>
      {score}
    </span>
  );
};

// Filter component for the moderation queue
const ModerationFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput 
      source="status" 
      choices={[
        { id: 'pending', name: 'Pending' },
        { id: 'approved', name: 'Approved' },
        { id: 'rejected', name: 'Rejected' }
      ]} 
    />
    <SelectInput 
      source="contentType" 
      choices={[
        { id: 'text', name: 'Text' },
        { id: 'image', name: 'Image' },
        { id: 'video', name: 'Video' }
      ]} 
    />
    <NumberInput source="riskScore_gte" label="Min Risk Score" />
    <NumberInput source="riskScore_lte" label="Max Risk Score" />
  </Filter>
);

// Custom bulk action buttons
const ModerationBulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

// Custom action buttons for the list
const ModerationListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// Moderation queue list component
export const ModerationList = props => (
  <List 
    filters={<ModerationFilter />} 
    bulkActionButtons={<ModerationBulkActionButtons />}
    actions={<ModerationListActions />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ChipField source="contentType" />
      <TextField source="status" />
      <RiskScoreField source="riskScore" label="Risk Score" />
      <ReferenceField source="userId" reference="users">
        <TextField source="displayName" />
      </ReferenceField>
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

// Moderation queue edit component
export const ModerationEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <SelectInput 
        source="contentType" 
        choices={[
          { id: 'text', name: 'Text' },
          { id: 'image', name: 'Image' },
          { id: 'video', name: 'Video' }
        ]} 
        disabled
      />
      <SelectInput 
        source="status" 
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'approved', name: 'Approved' },
          { id: 'rejected', name: 'Rejected' }
        ]} 
      />
      <NumberInput source="riskScore" disabled />
      
      <TextInput source="content" multiline fullWidth disabled />
      <ImageField source="mediaUrl" title="Content Preview" />
      
      <TextInput source="moderationNotes" multiline fullWidth />
      <TextInput source="rejectionReason" multiline fullWidth />
      
      <ReferenceField source="userId" reference="users">
        <TextField source="displayName" />
      </ReferenceField>
      
      <DateInput disabled source="createdAt" />
      <DateInput disabled source="updatedAt" />
    </SimpleForm>
  </Edit>
); 