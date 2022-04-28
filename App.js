import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback  } from 'react-native';
import Constants from 'expo-constants';
import {reducer, initialState, GameActionType, GameScore} from './logic'

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <View style={styles.container}>
      <View style={styles.topBar}> 
        <View style={styles.info}>
          <Text style={styles.infoTitle}>Turns</Text>
          <Text style={styles.infoValue}>{state.turns}</Text>
        </View>
        {/*<Text style={styles.title}>Try to beat me,</Text> 
        <Text style={styles.title}>if you can</Text>*/}
        <View style={styles.info}>
          <Text style={styles.infoTitle}>{state.score === GameScore.None? 'Status' : 'winner'}</Text>
          <Text style={styles.infoValue}>{state.score === GameScore.Ai && '💻'}{state.score === GameScore.Human && '💪🏼'}{state.score === GameScore.Tie && '😅 Tie'}{state.score === GameScore.None && '🚀'}</Text>
        </View>
      </View>
      <View style={styles.ticTacToeContainer}>
        <View style={styles.ticTacToeComponent}>
          <View style={styles.ticSection}>
            {state.board.slice(0,3).map((value, index)=><TouchableWithoutFeedback key={index} onPress={() => {
              state.score === GameScore.None && dispatch({type: GameActionType.TURN_UP})
              setTimeout(()=>{
                dispatch({
                  type: GameActionType.TURN_HUMAN,
                  payload: {
                    index,
                  },
                })
              },0)
                
              }}><View style={styles.ticCell}><Text style={styles.textCell}>{value}</Text></View></TouchableWithoutFeedback>)}
          </View>
          <View style={styles.ticSection}>
            {state.board.slice(3,6).map((value, index)=><TouchableWithoutFeedback key={index} onPress={() => {
                state.score === GameScore.None && dispatch({type: GameActionType.TURN_UP})
              setTimeout(()=>{
                dispatch({
                  type: GameActionType.TURN_HUMAN,
                  payload: {
                    index: index+3 ,
                  },
                })
              },0)
              }}><View style={styles.ticCell}><Text style={styles.textCell}>{value}</Text></View></TouchableWithoutFeedback>)}
          </View>
          <View style={styles.ticSection}>
            {state.board.slice(6,9).map((value, index)=><TouchableWithoutFeedback key={index} onPress={() => {
                state.score === GameScore.None && dispatch({type: GameActionType.TURN_UP})
              setTimeout(()=>{
                dispatch({
                  type: GameActionType.TURN_HUMAN,
                  payload: {
                    index: index+6,
                  },
                })
              },0)
              }}><View style={styles.ticCell}><Text style={styles.textCell}>{value}</Text></View></TouchableWithoutFeedback>)}
          </View>
          <View style={styles.topLine}/>
          <View style={styles.leftLine}/>
          <View style={styles.rightLine}/>
          <View style={styles.bottomLine}/>
          
        </View>
      </View>
      <View style={styles.bottomBar}>
        <Button onPress={() => {
          dispatch({
            type: GameActionType.RESET,
          })
        }} title="Replay" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    fontSize:25
  },
  topBar: {
    height: 200,
    flexShrink: 1,
    flexDirection:'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  bottomBar: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticTacToeContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticTacToeComponent:{
    position: 'relative',
    margin: 'auto',
    aspectRatio: 1,
    height: 312,
    width: 312,
    flexDirection: 'column'
  },
  ticCell:{
    borderWidth: 3,
    borderColor:'#000',
    width: 104,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticSection:{
    flexDirection: 'row'
  },
  textCell:{
    fontSize:90,
    position:'absolute',
  },
  topLine:{
    position:'absolute',
    positionTop:0,
    width:312,
    height:3,
    backgroundColor: 'white'
  },
  bottomLine:{
    position:'absolute',
    marginTop: 309,
    width:312,
    height:3,
    backgroundColor: 'white'
  },
  rightLine:{
    position:'absolute',
    marginLeft: 309,
    width:3,
    height:312,
    backgroundColor: 'white'
  },
  leftLine:{
    position:'absolute',
    marginLeft:0,
    width:3,
    height:312,
    backgroundColor: 'white'
  },
  info:{
    alignItems: 'flex-end',
    flexDirection:'row'
  },
  infoTitle:{},
  infoValue:{fontSize:50},
});
