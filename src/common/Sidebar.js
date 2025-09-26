// import React, { useState, useEffect } from "react";
// import { Nav, Button, Collapse, Tooltip, OverlayTrigger } from "react-bootstrap";
// import { 
//   House, 
//   People, 
//   Gear, 
//   Cart, 
//   Box, 
//   Tag, 
//   ChevronLeft, 
//   ChevronRight,
//   GraphUp,
//   ListCheck
// } from "react-bootstrap-icons";
// import { useLocation, useNavigate } from "react-router-dom";

// const Sidebar = () => {
//   const [open, setOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Check if mobile on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768) {
//         setOpen(false);
//       }
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Navigation items configuration
//   const navItems = [
//     { path: "/admin/dashboard", icon: House, label: "Dashboard", badge: null },
//     { path: "/admin/users", icon: People, label: "Users", badge: null },
//     { path: "/admin/orders", icon: Cart, label: "Orders", badge: "12" },
//     { path: "/admin/products", icon: Box, label: "Products", badge: null },
//     { path: "/admin/categories", icon: Tag, label: "Categories", badge: null },
//     { path: "/admin/analytics", icon: GraphUp, label: "Analytics", badge: "New" },
//     { path: "/admin/settings", icon: Gear, label: "Settings", badge: null },
//   ];

//   // Check if a nav item is active
//   const isActive = (path) => {
//     if (path === "/admin/dashboard") {
//       return location.pathname === path;
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Handle navigation
//   const handleNavigation = (path) => {
//     navigate(path);
//     if (isMobile) {
//       setOpen(false); // Auto-close on mobile after navigation
//     }
//   };

//   // Tooltip for collapsed state
//   const renderTooltip = (label) => (
//     <Tooltip id={`tooltip-${label}`}>{label}</Tooltip>
//   );

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && open && (
//         <div 
//           className="bg-dark bg-opacity-50 position-fixed w-100 h-100"
//           style={{ zIndex: 1039, top: 0, left: 0 }}
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`bg-dark text-white position-fixed h-100 ${
//           open ? "sidebar-open" : "sidebar-collapsed"
//         } ${isMobile && !open ? "d-none" : ""}`}
//         style={{
//           transition: "all 0.3s ease",
//           width: open ? "250px" : "70px",
//           zIndex: 1040,
//           left: 0,
//           top: 0,
//           boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
//         }}
//       >
//         {/* Header */}
//         <div className="p-3 border-bottom border-secondary">
//           <div className="d-flex align-items-center justify-content-between">
//             <Collapse in={open}>
//               <div>
//                 <h5 className="mb-0 fw-bold text-primary">Admin Panel</h5>
//                 <small className="text-muted">Management Console</small>
//               </div>
//             </Collapse>
            
//             <Button
//               variant="outline-light"
//               size="sm"
//               className="rounded-circle p-1"
//               style={{ width: '32px', height: '32px' }}
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <Nav className="flex-column p-3">
//           {navItems.map((item) => {
//             const IconComponent = item.icon;
//             const active = isActive(item.path);
            
//             const navContent = (
//               <div 
//                 className={`d-flex align-items-center p-2 rounded-3 mb-2 cursor-pointer ${
//                   active 
//                     ? "bg-primary text-white" 
//                     : "text-white-50 hover-bg-light hover-text-dark"
//                 }`}
//                 style={{
//                   transition: "all 0.2s ease",
//                   cursor: "pointer"
//                 }}
//                 onClick={() => handleNavigation(item.path)}
//               >
//                 <IconComponent size={18} className="flex-shrink-0" />
                
//                 <Collapse in={open}>
//                   <div className="d-flex align-items-center justify-content-between w-100 ms-3">
//                     <span className="fw-medium">{item.label}</span>
//                     {item.badge && (
//                       <span className={`badge ${
//                         item.badge === "New" ? "bg-success" : "bg-secondary"
//                       } badge-sm`}>
//                         {item.badge}
//                       </span>
//                     )}
//                   </div>
//                 </Collapse>
//               </div>
//             );

//             return (
//               <div key={item.path}>
//                 {!open ? (
//                   <OverlayTrigger
//                     placement="right"
//                     delay={{ show: 100, hide: 200 }}
//                     overlay={renderTooltip(item.label)}
//                   >
//                     {navContent}
//                   </OverlayTrigger>
//                 ) : (
//                   navContent
//                 )}
//               </div>
//             );
//           })}
//         </Nav>

//         {/* Footer */}
//         <div className="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
//           <Collapse in={open}>
//             <div className="text-center">
//               <small className="text-muted">
//                 v1.0.0 • {new Date().getFullYear()}
//               </small>
//             </div>
//           </Collapse>
//         </div>
//       </div>

//       {/* Main content spacer */}
//       <div style={{ 
//         marginLeft: isMobile ? '0px' : (open ? '250px' : '70px'),
//         transition: "margin-left 0.3s ease",
//         minHeight: "100vh"
//       }}>
//         {/* Mobile menu toggle button */}
//         {isMobile && !open && (
//           <Button
//             variant="dark"
//             className="position-fixed rounded-circle p-2"
//             style={{
//               bottom: '20px',
//               left: '20px',
//               zIndex: 1039,
//               width: '50px',
//               height: '50px'
//             }}
//             onClick={() => setOpen(true)}
//           >
//             <ListCheck size={20} />
//           </Button>
//         )}
//       </div>

//       <style>{`
//         .hover-bg-light:hover {
//           background-color: rgba(255,255,255,0.1) !important;
//         }
        
//         .hover-text-dark:hover {
//           color: white !important;
//         }
        
//         .cursor-pointer {
//           cursor: pointer;
//         }
        
//         .badge-sm {
//           font-size: 0.65em;
//           padding: 0.25em 0.4em;
//         }
        
//         /* Smooth transitions for all interactive elements */
//         .nav-link {
//           transition: all 0.2s ease;
//         }
        
//         /* Mobile optimizations */
//         @media (max-width: 767.98px) {
//           .sidebar-open {
//             width: 280px !important;
//           }
          
//           .sidebar-collapsed {
//             transform: translateX(-100%);
//           }
//         }
        
//         /* Custom scrollbar for sidebar */
//         .bg-dark::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         .bg-dark::-webkit-scrollbar-track {
//           background: rgba(255,255,255,0.1);
//         }
        
//         .bg-dark::-webkit-scrollbar-thumb {
//           background: rgba(255,255,255,0.3);
//           border-radius: 3px;
//         }
        
//         .bg-dark::-webkit-scrollbar-thumb:hover {
//           background: rgba(255,255,255,0.5);
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Nav, Button, Collapse, Tooltip, OverlayTrigger, Badge } from "react-bootstrap";
import { 
  House, 
  People, 
  //Gear, 
  Cart, 
  Box, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
 // GraphUp,
  ListCheck
} from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation items configuration
  const navItems = [
    { path: "/admin/dashboard", icon: House, label: "Dashboard", badge: null },
    { path: "/admin/users", icon: People, label: "Users", badge: null },
    { path: "/admin/orders", icon: Cart, label: "Orders", badge: null },
    { path: "/admin/products", icon: Box, label: "Products", badge: null },
    { path: "/admin/categories", icon: Tag, label: "Categories", badge: null },
    // { path: "/admin/analytics", icon: GraphUp, label: "Analytics", badge: "New" },
    // { path: "/admin/settings", icon: Gear, label: "Settings", badge: null },
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  // Tooltip for collapsed state
  const renderTooltip = (label, badge) => (
    <Tooltip id={`tooltip-${label}`}>
      {label} {badge && `(${badge})`}
    </Tooltip>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="bg-dark bg-opacity-50 position-fixed w-100 h-100"
          style={{ zIndex: 1039, top: 0, left: 0 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-dark text-white position-fixed h-100 ${
          open ? "sidebar-open" : "sidebar-collapsed"
        } ${isMobile && !open ? "d-none" : ""}`}
        style={{
          transition: "all 0.3s ease",
          width: open ? "250px" : "70px",
          zIndex: 1040,
          left: 0,
          top: 0,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center justify-content-between">
            <Collapse in={open}>
              <div>
                <h5 className="mb-0 fw-bold text-primary">Admin Panel</h5>
                <small className="text-muted">Management Console</small>
              </div>
            </Collapse>
            
            <Button
              variant="outline-light"
              size="sm"
              className="rounded-circle p-1"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setOpen(!open)}
            >
              {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Nav className="flex-column p-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            const navContent = (
              <div 
                className={`d-flex align-items-center p-2 rounded-3 mb-2 position-relative ${
                  active 
                    ? "bg-primary text-white" 
                    : "text-white-50 hover-bg-light hover-text-dark"
                }`}
                style={{
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  minHeight: '45px'
                }}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="d-flex align-items-center flex-grow-1">
                  <IconComponent size={18} className="flex-shrink-0" />
                  
                  {/* Text and badge that collapses */}
                  <Collapse in={open} dimension="width">
                    <div className="d-flex align-items-center justify-content-between w-100 ms-3">
                      <span className="fw-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          bg={item.badge === "New" ? "success" : "secondary"} 
                          className="badge-sm"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Collapse>
                </div>

                {/* Badge for collapsed state - positioned absolutely */}
                {!open && item.badge && (
                  <Badge 
                    bg={item.badge === "New" ? "success" : "secondary"} 
                    className="position-absolute top-0 start-100 translate-middle badge-sm"
                    style={{ zIndex: 1 }}
                  >
                    {item.badge}
                  </Badge>
                )}

                {/* Active indicator for collapsed state */}
                {!open && active && (
                  <div 
                    className="position-absolute top-50 end-0 translate-middle-y bg-primary rounded-start"
                    style={{ width: '4px', height: '20px' }}
                  />
                )}
              </div>
            );

            return (
              <div key={item.path} className="position-relative">
                {!open ? (
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 100, hide: 200 }}
                    overlay={renderTooltip(item.label, item.badge)}
                  >
                    {navContent}
                  </OverlayTrigger>
                ) : (
                  navContent
                )}
              </div>
            );
          })}
        </Nav>

        {/* Footer */}
        <div className="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
          <Collapse in={open}>
            <div className="text-center">
              <small className="text-muted">
                v1.0.0 • {new Date().getFullYear()}
              </small>
            </div>
          </Collapse>
          {!open && (
            <div className="text-center">
              <small className="text-muted">⋯</small>
            </div>
          )}
        </div>
      </div>

      {/* Main content spacer */}
      <div style={{ 
        marginLeft: isMobile ? '0px' : (open ? '250px' : '70px'),
        transition: "margin-left 0.3s ease",
        minHeight: "100vh"
      }}>
        {/* Mobile menu toggle button */}
        {isMobile && !open && (
          <Button
            variant="dark"
            className="position-fixed rounded-circle p-2"
            style={{
              bottom: '20px',
              left: '20px',
              zIndex: 1039,
              width: '50px',
              height: '50px'
            }}
            onClick={() => setOpen(true)}
          >
            <ListCheck size={20} />
          </Button>
        )}
      </div>

      <style>{`
        .hover-bg-light:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }
        
        .hover-text-dark:hover {
          color: white !important;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .badge-sm {
          font-size: 0.65em;
          padding: 0.25em 0.4em;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Smooth transitions for all interactive elements */
        .nav-link {
          transition: all 0.2s ease;
        }
        
        /* Mobile optimizations */
        @media (max-width: 767.98px) {
          .sidebar-open {
            width: 280px !important;
          }
          
          .sidebar-collapsed {
            transform: translateX(-100%);
          }
        }
        
        /* Custom scrollbar for sidebar */
        .bg-dark::-webkit-scrollbar {
          width: 6px;
        }
        
        .bg-dark::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
        }
        
        .bg-dark::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        
        .bg-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }

        /* Fix for collapse transition */
        .collapse:not(.show) {
          display: none;
        }

        .collapsing {
          height: 0;
          overflow: hidden;
          transition: height 0.35s ease;
        }

        /* Ensure proper badge positioning in collapsed state */
        .position-relative {
          position: relative;
        }

        .translate-middle {
          transform: translate(-50%, -50%);
        }

        .translate-middle-y {
          transform: translateY(-50%);
        }
      `}</style>
    </>
  );
};

export default Sidebar;