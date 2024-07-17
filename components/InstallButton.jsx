import React, { useEffect, useState } from 'react';

function InstallButton() {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const isInstallButtonVisible = localStorage.getItem('showInstallButton') === 'true';
    setShowInstallButton(isInstallButtonVisible);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      localStorage.setItem('showInstallButton', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', (e) => {
        setDeferredPrompt(null);
      });
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário recusou a instalação');
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
        localStorage.removeItem('showInstallButton');
      });
    }
  };

  return (
    <>
      {showInstallButton && (
        <div>
          <button id='btn-instalar' className='btn' onClick={handleInstallClick}>
            Instalar
          </button>
        </div>
      )}
    </>
  );
}

export default InstallButton;
