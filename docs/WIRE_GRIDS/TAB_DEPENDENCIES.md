# Tab Dependencies

```mermaid
graph TD
    Dashboard --> NewEstimate
    NewEstimate --> Projects
    Inventory --> MaterialsCosts
    Suppliers --> MaterialsCosts
    MaterialsCosts --> NewEstimate
    Projects --> Contracts
    Contracts --> ChangeOrders
    Contracts --> SignOff
    Projects --> Reports
    Projects --> CustomerPortal
    Contracts --> Scheduling
    Scheduling --> CrewManagement
    Projects --> PhotoGallery
    PhotoGallery --> Mapping
    Analytics --> Reports
    Settings --> Dashboard
```
