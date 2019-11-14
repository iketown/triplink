export enum TravelTypes {
  air = 'Airplane',
  taxi = 'Taxi/Uber',
  train = 'Train',
  shuttleBus = 'Shuttle bus',
  tourBus = 'Tour bus'
}

export interface ITravelDialog {
  initialValues: {}
  handleClose: () => void
}
