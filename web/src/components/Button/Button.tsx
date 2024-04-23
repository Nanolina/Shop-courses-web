import './Button.css';

function Button(props: any) {
  return <button {...props} className={'button ' + props.className} />;
}

export default Button;
