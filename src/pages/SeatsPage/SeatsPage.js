import styled from "styled-components"
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";


export default function SeatsPage(props) {
    const params = useParams();
    
    const [assentos, setAssentos] = useState(undefined);
    const [selecionado, setSelecionado] = useState([]);
    const [nome, setNome] = useState();
    const [cpf, setCpf] = useState();
    const [ids,setIds] = useState([]);
    
    
    const requisicao = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${params.idSessao}/seats`)
    
    useEffect(() => {
    
        requisicao.then(resposta => {
            setAssentos(resposta.data)
	    });

        requisicao.catch(erro => {
		    console.log(erro.response.data)
	    });

    }, []);

    if (assentos === undefined){
        return (
            <div>
                carregando...
            </div>
        )
    }
    function cor(i){
        if (assentos.seats[i].isAvailable === false){
            return alert("Esse assento não está disponível")
        }
        if (selecionado.includes(i)){
                let array = selecionado
                let arrayids = ids
                let index = selecionado.indexOf(i);
                array.splice(index,1)
                arrayids.splice(index,1)
                setSelecionado([...array])
                setIds([...arrayids])
            } else {
                setSelecionado([...selecionado, i])
                setIds([...ids,assentos.seats[i].id])
                
            }
        } 
       
         function reservar(){
            props.setDados({ids:ids, name:nome,cpf:cpf})
            props.setSucesso({filme:assentos.movie.title, data:assentos.day.date ,hora:assentos.name, assentos:selecionado})
         }
         
        console.log(props.dados)
   
    return (
        <PageContainer>
           
            Selecione o(s) assento(s)
            
            <SeatsContainer>
                
                {assentos.seats.map((a,i) => <SeatItem data-test="seat" onClick={() => cor(i)} key={a.id} assentos={assentos} selecionado={selecionado} i={i}>{a.name} </SeatItem>)}
                
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                Nome do Comprador:
                <input data-test="client-name" value={nome} onChange={(e)=> setNome(e.target.value) } placeholder="Digite seu nome..." />

                CPF do Comprador:
                <input data-test="client-cpf" value={cpf} onChange={(e)=> setCpf(e.target.value)} placeholder="Digite seu CPF..." />

                <Link to={`/sucesso`}><button data-test="book-seat-btn" onClick={reservar}>Reservar Assento(s)</button></Link>
            </FormContainer>

            <FooterContainer data-test="footer" >
                <div >
                    <img src={assentos.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{assentos.movie.title}</p>
                    <p>{assentos.day.weekday} - {assentos.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
    a{
        text-decoration:none;
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
    div:first-child div{
        border: 1px solid #0E7D71;
        background-color: #1AAE9E;
    }
    && div:nth-child(2) div{
        border: 1px solid #808F9D;
        background-color: #C3CFD9;
    }
    && div:last-child div{
        border: 1px solid #F7C52B;
        background-color: #FBE192;
    }
`
const CaptionCircle = styled.div`
           // Essa cor deve mudar
        // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    
`
const SeatItem = styled.div`
    border: 1px solid ${props => (props.assentos.seats[props.i].isAvailable === true) ? ((props.selecionado.includes(props.i)) ? "#0E7D71" : "#808F9D") : "#F7C52B" };
    background-color: ${props => (props.assentos.seats[props.i].isAvailable === true) ? ((props.selecionado.includes(props.i)) ? "#1AAE9E" : "#C3CFD9") : "#FBE192" }; 
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`