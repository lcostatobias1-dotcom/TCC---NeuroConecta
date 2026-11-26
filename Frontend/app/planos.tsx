import { AccessibleText as Text } from '../components/Accessibility';
import React from 'react';
import { View, NativeText, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Planos() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.voltar}>‹ Voltar</Text></TouchableOpacity>
        <Text style={styles.emoji}>👑</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Escolha o plano ideal para você</Text>
        <Text style={styles.subtitulo}>Recursos para desenvolver sua autonomia, respeitando seu ritmo.</Text>
        <View style={styles.cardPlano}>
          <Text style={styles.nomePlano}>🌱 Plano Gratuito</Text>
          <Text style={styles.preco}>R$ 0,00</Text><Text style={styles.periodo}>para sempre</Text>
          <View style={styles.linha}/>
          <Text style={styles.inclui}>Inclui:</Text>
          {['Até 5 tarefas','Até 3 metas','Agenda e organização diária','Finanças básicas','Relatório mensal'].map(x=><Text key={x} style={styles.item}>✓ {x}</Text>)}
          <View style={styles.avisoGratis}><Text style={styles.avisoGratisTexto}>🔒 A Biblioteca de vídeos e conteúdos é exclusiva do Plano Premium.</Text></View>
          <View style={styles.botaoGratuito}><Text style={styles.textoBotaoGratuito}>Plano gratuito</Text></View>
        </View>
        <View style={styles.cardPremium}>
          <View style={styles.tag}><Text style={styles.tagTexto}>ACESSO COMPLETO</Text></View>
          <Text style={styles.nomePremium}>👑 Plano Premium</Text>
          <Text style={styles.incluiPremium}>Tudo do gratuito, mais:</Text>
          {['Biblioteca completa de vídeos e conteúdos','Tarefas e subtarefas ilimitadas','Metas e etapas ilimitadas','Lembretes personalizados','Finanças avançadas e histórico completo','Relatórios por dia, mês, ano ou período'].map(x=><Text key={x} style={styles.itemPremium}>✓ {x}</Text>)}
          <View style={styles.opcaoPreco}>
            <View style={{flex:1}}><Text style={styles.tipoPreco}>Premium Mensal</Text><Text style={styles.precoPremium}>R$ 19,99</Text><Text style={styles.periodoPremium}>por mês</Text></View>
            <TouchableOpacity style={styles.botaoPremium} onPress={()=>router.push({pathname:'/premium',params:{periodo:'mensal',valor:'19.99'}})}><Text style={styles.textoBotaoPremium}>Escolher mensal</Text></TouchableOpacity>
          </View>
          <View style={styles.divisor}/>
          <View style={styles.opcaoPreco}>
            <View style={{flex:1}}><Text style={styles.tipoPreco}>Premium Anual</Text><Text style={styles.precoPremium}>R$ 299,00</Text><Text style={styles.periodoPremium}>por ano</Text></View>
            <TouchableOpacity style={styles.botaoPremium} onPress={()=>router.push({pathname:'/premium',params:{periodo:'anual',valor:'299.00'}})}><Text style={styles.textoBotaoPremium}>Escolher anual</Text></TouchableOpacity>
          </View>
        </View>
        <Text style={styles.observacao}>A contratação e a cobrança dos planos serão habilitadas na etapa de implantação dos pagamentos.</Text>
      </ScrollView>
    </View>
  );
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#F7F3FB'},cabecalho:{paddingTop:50,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},voltar:{fontSize:16,color:'#8E62B7',fontWeight:'600',paddingVertical:8},emoji:{fontSize:28},conteudo:{padding:20,paddingBottom:45},titulo:{fontSize:25,fontWeight:'bold',color:'#30243B',marginBottom:8},subtitulo:{fontSize:14,color:'#6D6575',lineHeight:21,marginBottom:22},cardPlano:{backgroundColor:'#FFF',borderRadius:20,padding:20,marginBottom:18,borderWidth:1,borderColor:'#E5DDED'},nomePlano:{fontSize:20,fontWeight:'bold',color:'#51405F'},preco:{fontSize:30,fontWeight:'bold',color:'#333',marginTop:8},periodo:{fontSize:13,color:'#777'},linha:{height:1,backgroundColor:'#EAE3F0',marginVertical:16},inclui:{fontSize:15,fontWeight:'bold',color:'#51405F',marginBottom:8},item:{fontSize:14,color:'#555',marginVertical:5},avisoGratis:{backgroundColor:'#FFF4DD',borderRadius:12,padding:12,marginTop:14},avisoGratisTexto:{color:'#76551C',fontSize:13,lineHeight:19,fontWeight:'600'},botaoGratuito:{marginTop:16,padding:13,borderRadius:12,backgroundColor:'#F0ECF3',alignItems:'center'},textoBotaoGratuito:{color:'#65576F',fontWeight:'bold'},cardPremium:{backgroundColor:'#F1E8FC',borderWidth:1.5,borderColor:'#B993D7',borderRadius:20,padding:20,marginBottom:18},tag:{alignSelf:'flex-start',backgroundColor:'#8E62B7',borderRadius:20,paddingHorizontal:12,paddingVertical:6,marginBottom:14},tagTexto:{color:'#FFF',fontWeight:'bold',fontSize:11},nomePremium:{fontSize:21,fontWeight:'bold',color:'#54356F',marginBottom:12},incluiPremium:{fontSize:14,fontWeight:'bold',color:'#654B79',marginBottom:7},itemPremium:{fontSize:13,color:'#554660',marginVertical:4,lineHeight:19},opcaoPreco:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:14,padding:13,marginTop:14},tipoPreco:{fontSize:14,fontWeight:'bold',color:'#4E3A5D'},precoPremium:{fontSize:24,fontWeight:'bold',color:'#70469A',marginTop:3},periodoPremium:{fontSize:12,color:'#777'},botaoPremium:{backgroundColor:'#8E62B7',borderRadius:10,paddingHorizontal:12,paddingVertical:12},textoBotaoPremium:{color:'#FFF',fontWeight:'bold',fontSize:12},divisor:{height:1,backgroundColor:'#D9C8E7',marginTop:14},observacao:{fontSize:12,color:'#777',textAlign:'center',lineHeight:18,marginTop:4}});
