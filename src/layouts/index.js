// import styles from './index.css';

function BasicLayout(props) {
  
  return (
    <div style={{margin: 0, padding: 0}}>
      {props.children}
    </div>
  );
}

export default BasicLayout;
