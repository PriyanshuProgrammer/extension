import {useState} from "react";
import ReactDOM from "react-dom/client";
import * as InboxSDK from "@inboxsdk/core"; 
const container = document.createElement("div");
const root = ReactDOM.createRoot(container);

const MainApp = () => {
  const [isLoading, setIsLoading] = useState(false);
 const handleNotionConnect = async () => {
    setIsLoading(true);
    let response = await fetch('YOUR_BACKEND_URL', {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        userId: "demo-user-id-23423423", 
        app: "notion"
      })
    });
    let data = await response.json();
    console.log("the data is ", data);
    if(data.connectUrl){
      window.open(data.connectUrl, "_blank");
      setIsLoading(false);
    }
  };

  return(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '40px 20px',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
        </div>
       <p style={{
          fontSize: '16px',
          opacity: '0.9',
          margin: '0',
          lineHeight: '1.5'
        }}>
          Connect your Gmail with Notion to seamlessly organize and manage your emails
        </p>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleNotionConnect}
        disabled={isLoading}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          padding: '16px 32px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
        }}
      >
        <img 
          src="https://www.notion.so/front-static/favicon.ico" 
          alt="Notion"
          style={{
            width: '20px',
            height: '20px'
          }}
        />
        Connect with Notion
      </button>

      {/* Footer */}
      <p style={{
        fontSize: '12px',
        opacity: '0.7',
        marginTop: '32px',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        Your data is encrypted and secure.<br/>
        You can disconnect at any time.
      </p>
    </div>
  )
}

root.render(
  <MainApp/>
);

InboxSDK.load(2).then((sdk) => {
  sdk.AppMenu.addMenuItem({
    name: "Plug",
    onClick: () => {
      sdk.Widgets.showModalView({
        title: "Integrations",
        el: container
      });
    },
    className: "my-menu-item",
  });
  const style = document.createElement("style");
  style.textContent = `
    .my-menu-item > div::before {
    background-image: url(https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-plus-icon-png-image_3989579.jpg) !important;
    background-size: cover;
    background-position: center;
   }
 `;
  document.head.appendChild(style);
});