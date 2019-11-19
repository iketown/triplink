import React, { Dispatch, SetStateAction } from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Avatar,
  IconButton
} from "@material-ui/core";
import TextInput from "../Forms/inputs/TextInput";
import ShowMe from "../../utils/ShowMe";
import UploadWidget, { IImageInfo } from "../Images/cloudinary/UploadWidget";
import CloudAvatar from "../Images/cloudinary/CloudAvatar";
// @ts-ignore
import { useFirebaseCtx } from "../Firebase";
import { Person } from "./people.types";
import { Save, Group } from "@material-ui/icons";
import HomeAirportPicker from "../Forms/inputs/HomeAirportPicker";
import AddressInput from "../Forms/inputs/AddressInput";
//
//

const PersonForm = ({
  setEditing,
  person
}: {
  setEditing: Dispatch<SetStateAction<boolean>>;
  person?: Person;
}) => {
  const { doCreatePerson, doUpdatePerson, doResetAirports } = useFirebaseCtx();

  const onSubmit = async (values: any) => {
    if (values.id) {
      await doUpdatePerson(values);
    } else {
      await doCreatePerson(values);
    }
    setEditing(false);
  };

  const initialValues = person || {
    firstName: "",
    lastName: "",
    avatarURL: "",
    avatarPublicId: "",
    displayName: "",
    email: ""
  };

  const validate = (values: any) => {
    const errors: any = {};
    const { firstName, lastName, displayName, email } = values;
    [
      { fieldName: "firstName", value: "First Name" },
      { fieldName: "lastName", value: "Last Name" },
      { fieldName: "displayName", value: "Display Name" },
      { fieldName: "email", value: "Email" }
    ].forEach(({ fieldName, value }) => {
      if (!values[fieldName]) errors[fieldName] = `${value} is required`;
    });
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      mutators={{ ...arrayMutators }}
    >
      {({
        handleSubmit,
        values,
        form,
        hasValidationErrors,
        submitting,
        pristine
      }) => {
        const setDefaultDisplayName = (lastName: string) => {
          if (values.firstName && values.lastName) {
            form.change(
              "displayName",
              `${values.firstName.slice(0, 1)}_${lastName}`
            );
          }
        };
        return (
          <form onSubmit={handleSubmit}>
            <>
              <CardHeader
                avatar={
                  values.avatarURL ? (
                    <div style={{ display: "flex" }}>
                      <CloudAvatar publicId={values.avatarPublicId} />
                      <UploadWidget buttonText="Change Photo" />
                    </div>
                  ) : (
                    <UploadWidget buttonText="Upload Photo" />
                  )
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextInput label="First Name" name="firstName" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Last Name"
                      name="lastName"
                      extraOnChange={setDefaultDisplayName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput label="Display Name" name="displayName" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput label="Email" name="email" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput label="Phone 1" name="phone1" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput label="Phone 2" name="phone2" />
                  </Grid>
                  <Grid item xs={12}>
                    <AddressInput />
                  </Grid>
                  <Grid item xs={12}>
                    {<HomeAirportPicker />}
                    {person && person.id && (
                      <Button
                        onClick={() =>
                          doResetAirports({ ...values, id: person.id })
                        }
                      >
                        reset airports
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions style={{ justifyContent: "space-between" }}>
                <Button onClick={() => setEditing(false)}>cancel</Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={hasValidationErrors || submitting || pristine}
                  type="submit"
                >
                  Save
                </Button>
              </CardActions>
              <ShowMe obj={values} name="values" noModal />
            </>
          </form>
        );
      }}
    </Form>
  );
};

export default PersonForm;

const fakeResponse = {
  avatarURL: {
    public_id: "avatars/coaehyrl8x3kntcg3jy7",
    version: 1573857526,
    signature: "3f3651f35e99aef29d953d3aa9297e590d189b8f",
    width: 720,
    height: 1080,
    format: "jpg",
    resource_type: "image",
    created_at: "2019-11-15T22:38:46Z",
    tags: [],
    bytes: 138212,
    type: "upload",
    etag: "13a08b437969677d5a386383686b3efa",
    placeholder: false,
    url:
      "http://res.cloudinary.com/iketown/image/upload/v1573857526/avatars/coaehyrl8x3kntcg3jy7.jpg",
    secure_url:
      "https://res.cloudinary.com/iketown/image/upload/v1573857526/avatars/coaehyrl8x3kntcg3jy7.jpg",
    access_mode: "public",
    original_filename: "Beach Boys Concert Ocean Grove-4",
    path: "v1573857526/avatars/coaehyrl8x3kntcg3jy7.jpg",
    thumbnail_url:
      "https://res.cloudinary.com/iketown/image/upload/c_limit,h_60,w_90/v1573857526/avatars/coaehyrl8x3kntcg3jy7.jpg"
  }
};
