
import { Button, Layout, Switch } from 'antd';
import useConfigStore from '../../store/config';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;

const Headerbar = (props: { colorBgContainer: string }) => {
  const setAlgorithm = useConfigStore(state => state.setAlgorithm)
  const setCompactAlgorithm = useConfigStore(state => state.setCompactAlgorithm)

  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header title='React Admin Dashboard' style={{ padding: 0, background: props.colorBgContainer }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: "0 20px", justifyContent: 'space-between' }}>
        <h2>Calendar Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Switch checkedChildren="Light" unCheckedChildren="Dark" defaultChecked onChange={(checked) => setAlgorithm(checked ? 'default' : 'dark')} />
          <Switch checkedChildren="Compact" unCheckedChildren="Loose" onChange={(checked) => setCompactAlgorithm(checked ? 'compact' : '')} />
          <p style={{ marginRight: 10 }}>{user?.username}</p>
          <Button danger size="small" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </Header>
  )
}

export default Headerbar
