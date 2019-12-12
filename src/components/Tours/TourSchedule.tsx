import React, { useState, useEffect } from "react";
import { Tour } from "./types";
import {
  Scheduler,
  DayView,
  Appointments,
  ViewSwitcher,
  WeekView,
  MonthView,
  Toolbar,
  AllDayPanel,
  AppointmentForm,
  AppointmentTooltip,
  DateNavigator,
  Resources
} from "@devexpress/dx-react-scheduler-material-ui";
import { Paper, Button } from "@material-ui/core";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
  ChangeSet
} from "@devexpress/dx-react-scheduler";
import ShowMe from "../../utils/ShowMe";
import EventTooltip from "../Scheduler/EventTooltip";
import EventFormBasic from "../Scheduler/EventForm";
import moment from "moment-timezone";
import { useEvents, useMonthEvents } from "../Events/useEvents";
import { useFirebaseCtx } from "../Firebase";
import CustomAppointment from "./CustomAppointment";
import CustomApptContent from "./CustomApptContent";
import EventFormTextEditor, {
  EventFormLabelEditor
} from "../Scheduler/ScheduleFormComponents/EventFormTextEditor";
import EventFormDateEditor from "../Scheduler/ScheduleFormComponents/EventFormDateEditor";
import EventFormLayout from "../Scheduler/ScheduleFormComponents/EventFormLayout";
import { getOffsetEvent } from "./appointmentHelpers";
import { formValidator } from "../Scheduler/eventFormHelpers";
import { usePeople } from "../People/usePeople";
//
//
const TourSchedule = () => {
  const [currentViewName, setCurrentViewName] = useState("");
  const { allPeople } = usePeople();
  const [currentDate, setCurrentDate] = useState(moment().format());
  const { events, hourRange } = useMonthEvents(
    moment(currentDate)
      .startOf("month")
      .format("YYYY-MM")
  );
  const { doEditEvent, doCreateEvent, doDeleteEvent } = useFirebaseCtx();

  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (allPeople && allPeople.length) {
      setResources([
        {
          fieldName: "people",
          title: "People",
          allowMultiple: true,
          instances: allPeople.map(person => ({
            id: person.id,
            text: person.displayName
          }))
        }
      ]);
    }
  }, [allPeople]);
  // const { isValid, errors } = formValidator({
  //   ...editingAppt,
  //   ...addedAppt,
  //   ...apptChanges
  // });
  const handleFinishEdit = ({ added, changed, deleted }: ChangeSet) => {
    console.log("changes", { added, changed, deleted });
    if (added) {
      if (!added.title)
        added.title = added.startLoc ? added.startLoc.shortName : "untitled";
      //@ts-ignore
      doCreateEvent(added);
    }
    if (changed) {
      //@ts-ignore
      Object.entries(changed).forEach(([id, event]) => {
        doEditEvent({ id, ...event });
      });
    }
    if (deleted) {
      // delete event
      console.log("deleting", deleted);
      doDeleteEvent(String(deleted));
    }
  };
  if (!events) return <div>loading . . .</div>;

  return (
    <>
      <Paper>
        <Scheduler
          height={600}
          //@ts-ignore
          data={events.map(event => {
            const startDate = moment(event.startDate).toDate();
            const endDate = !!event.endDate
              ? moment(event.endDate).toDate()
              : moment(event.startDate)
                  .add(1, "hour")
                  .toDate();
            return {
              ...event,
              id: event.id,
              startDate,
              endDate
            };
          })}
        >
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={date => setCurrentDate(moment(date).format())}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <EditingState
            onCommitChanges={handleFinishEdit}
            // appointmentChanges={apptChanges}
            // onAppointmentChangesChange={setApptChanges}
            // addedAppointment={addedAppt}
            // onAddedAppointmentChange={setAddedAppt}
            // editingAppointment={editingAppt}
            // onEditingAppointmentChange={setEditingAppt}
          />
          <IntegratedEditing />
          <WeekView
            startDayHour={Math.max(0, hourRange.earliestHour - 1)}
            endDayHour={Math.min(24, hourRange.latestHour + 2)}
          />
          <MonthView />
          <DayView />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <Appointments
            appointmentComponent={CustomAppointment}
            appointmentContentComponent={CustomApptContent}
          />
          <AppointmentTooltip
            // contentComponent={EventTooltip}
            showOpenButton
            showDeleteButton
          />
          <Resources data={resources} mainResourceName="people" />
          <AppointmentForm
            basicLayoutComponent={EventFormBasic}
            // layoutComponent={EventFormLayout}
            commandLayoutComponent={(props, ...otherProps) => {
              return (
                <AppointmentForm.CommandLayout
                  {...props}
                  // disableSaveButton={!isValid}
                />
              );
            }}
            textEditorComponent={EventFormTextEditor}
            dateEditorComponent={EventFormDateEditor}
            labelComponent={EventFormLabelEditor}
          />
          <AllDayPanel />
        </Scheduler>
        <ShowMe obj={events} name="events" />
      </Paper>
      {/* <ShowMe
        obj={{ ...addedAppt, ...editingAppt, ...apptChanges }}
        name="appt plus changes"
        noModal
      /> */}
    </>
  );
};

export default TourSchedule;
