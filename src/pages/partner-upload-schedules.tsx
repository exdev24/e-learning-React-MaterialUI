import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl
} from '@material-ui/core';
import { Check, CloudUploadOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CLButton from '../client/components/cl-button';
import Layout from '../client/components/layout';

const fileInputId = 'cl-file-input';

export default function PartnerUploadSchedules() {
  const [fileSelected, setFileSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const error = router.query['error'];
  const success = router.query['success'];

  return (
    <Layout basic title="Upload schedules for partners">
      <Container maxWidth="sm" style={{ marginTop: 100, marginBottom: 100 }}>
        <Card>
          <CardHeader title="Upload schedules" />
          <CardContent>
            <form
              onSubmit={() => setIsSubmitting(true)}
              method="post"
              action="/partner-handle-file-upload"
              encType="multipart/form-data"
            >
              <FormControl fullWidth margin="normal">
                <label
                  htmlFor={fileInputId}
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  <input
                    id={fileInputId}
                    type="file"
                    accept="text/csv"
                    name="sheet"
                    style={{ display: 'none' }}
                    onChange={evt => {
                      const file = evt.target.files[0];
                      if (file) {
                        setFileSelected(true);
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    startIcon={fileSelected ? <Check /> : <CloudUploadOutlined />}
                    component="span"
                    variant="contained"
                    size="small"
                  >
                    {fileSelected ? 'File selected' : 'Choose a file to upload'}
                  </Button>
                </label>
              </FormControl>

              <CLButton
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
                loading={isSubmitting}
                disabled={!fileSelected}
              >
                Upload
              </CLButton>
            </form>

            {error && (
              <Alert color="error" style={{ marginTop: 24 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert color="success" style={{ marginTop: 24 }}>
                Schedules successfully uploaded!
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
