
// example of reusable component
// class Button extends Component {
//     render() {
//         const { 
//             onClick, 
//             className = "", 
//             children,
//         } = this.props;
//         return (
//             <button
//             onClick = { onClick }
//             className = { className }
//             type="button"
//             >
//             { children }
//             </button>
//         );
//     }
// }

// Example of composable component
// class Search extends Component {
//   render() {
//     // children is the word "Search" between opening and closing tags
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         { children } 
//         <input   
//           type = "text"
//           value = { value }
//           onChange = { onChange }
//         />
//       </form>
//     )
//   }
// }

//  Functional Stateless Component. Stage 1
// function Search(props) {
//   const { value, onChange, children } = props;
//   return (
//     <form>
//       {children} 
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   )
// }
    
//  Stage 2
// function Search( { value, onChange, children } ) {
//   return (
//     <form>
//       {children} 
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   )
// }

// class Table extends Component {
//   render() {
//     const { list, pattern, onDismiss } = this.props;
//     return(
//       <div>
//         {list.filter(isSearched(pattern)).map(item =>
//           <div key = { item.objectID }>
//             <span><a href = { item.url }>{item.title}</a></span>
//             <span>{ item.author }</span>
//             <span>{ item.num_comments }</span>
//             <span>{ item.points }</span>
//             <span>
//               <Button
//                 onClick={() => onDismiss(item.objectID)}
//               >
//                 Dismiss
//               </Button>
//             </span>
//           </div>
//         )}
//       </div>
//     )
//   }
// }

// types of functional stateless components
// const Greeting = (props) =>  {
//   return(
//     <div>
//         <p>greeting: {props.date}</p>
//         <p>snowfall</p>
//     </div>
//   )
// }

// const SecondGreeting = ({greeting}) => <p>greeting: {greeting}</p>

// function ThirdGreeting({greeting}){
//   return(
//     <p> 3rd greeting: {greeting}</p>
//   );
// }

// class Hello extends React.Component{
//   render() {
//     return (
//       <div>
        
//         <Greeting date={Date()} />
//         <SecondGreeting greeting="hi" />
//         <ThirdGreeting greeting="bonjour" />
        
//       </div>
//     );
//   }
// };

// ReactDOM.render(
//   <Hello/>,
//   document.getElementById('root')
// );