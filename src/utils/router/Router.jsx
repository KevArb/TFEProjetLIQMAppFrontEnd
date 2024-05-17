import { createBrowserRouter } from 'react-router-dom'
import EquipmentDetails from '../../components/Equipment/EquipmentDetails.jsx'
import LoginView from '../../components/LoginView/LoginView.jsx'
import UnauthoraizePage from '../../components/ErrorPages/UnauthoraizePage.jsx'
import NewEquipmentForm from '../../components/Equipment/NewEquipmentForm.jsx'
import UpdateEquipmentForm from '../../components/Equipment/UpdateEquipmentForm.jsx'
import App from '../../App.jsx'
import NewServiceForm from '../../components/Equipment/NewServiceForm.jsx'
import NewSupplierForm from '../../components/Equipment/NewSupplierForm.jsx'
import NewCategoryForm from '../../components/Equipment/NewCategoryForm.jsx'
import MaintenanceSheetView from '../../components/Maintenances/MaintenanceSheetView.jsx'
import IncidentView from '../../components/Incidents/IncidentView.jsx'
import UserProfile from '../../components/Users/UserProfile.jsx'
import AllIncidentsView from '../../components/Incidents/AllIncidentsView.jsx'
import AllMaintenanceSheetsView from '../../components/Maintenances/AllMaintenanceSheetsView.jsx'
import NewMaintenanceForm from '../../components/Maintenances/NewMaintenanceForm.jsx'
import ListServiceView from '../../components/Equipment/ListServiceView.jsx'
import ListSupplierView from '../../components/Equipment/ListSupplierView.jsx'
import AllMaintenances from '../../components/Maintenances/AllMaintenances.jsx'
import EquipmentCards from '../../components/Equipment/EquipmentsCards.jsx'
import UserList from '../../components/Users/UserList.jsx'

const router = createBrowserRouter([
    {
      path: '/',
      element: <App />
    },
    {
      path: '/equipments',
      element: <EquipmentCards />
    },
    {
      path: '/equipment-details/:id',
      element: <EquipmentDetails />
    },
    {
      path: '/equipment-details-update/:id',
      element: <UpdateEquipmentForm />
    },
    {
      path: '/login',
      element: <LoginView />
    }, 
    {
      path: '/401',
      element: <UnauthoraizePage />
    },
    {
      path: '/newEquipment',
      element: <NewEquipmentForm />
    },
    {
      path: '/newService',
      element: <NewServiceForm />
    },
    {
      path: '/newSupplier',
      element: <NewSupplierForm />
    },
    {
      path: '/newCategory',
      element: <NewCategoryForm />
    },
    {
      path: '/newMaintenance',
      element: <NewMaintenanceForm />
    },
    {
      path: '/:id/fm',
      element: <MaintenanceSheetView />
    },
    {
      path: '/:id/incident',
      element: <IncidentView />
    },
    {
      path: '/profile',
      element: <UserProfile />
    },
    {
      path: '/incidents',
      element: <AllIncidentsView />
    },
    {
      path: '/maintenance-sheet',
      element: <AllMaintenanceSheetsView />
    },
    {
      path: '/listServices',
      element: <ListServiceView />
    }, 
    {
      path: '/listSuppliers',
      element: <ListSupplierView />
    },
    {
      path: '/listMaintenances',
      element: <AllMaintenances />
    },
    {
      path: '/listUser',
      element: <UserList />
    }
  ])

  export default router