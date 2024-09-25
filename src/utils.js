export const reloadPage = () => {
  window.location.reload();
};

export const isOwner = (ip) => ip === import.meta.env.VITE_OWNER_IP;

export const getUserIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
};