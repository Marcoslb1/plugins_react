// src/components/ModalSalut.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

//======================================================================
//  === CONTROLE GLOBAL DA MODAL =======================================
//  Permite abrir/fechar a modal de qualquer lugar, sem criar estado local
//======================================================================

// estado default da modal
const configInicial = {
    abrir: false,
    tema: null,
    largura: null,
    fechar: true,
    linkFechar: null,
    automatico: 0,
    titulo: null,
    texto: null,
    novoComponente: null
};

// aqui ficam as referências internas para as funções globais
let controladorModal = {
    abrirInterno: null,
    fecharInterno: null
};

//
// FUNÇÕES GLOBAIS QUE VOCÊ VAI USAR NO PROJETO
//

// abre modal com configurações personalizadas
export function abrirModal(customConfig = {}) {
    if (controladorModal.abrirInterno) {
        controladorModal.abrirInterno(customConfig);
    }
}

// fecha apenas a modal do topo da pilha
export function fecharModal() {
    if (controladorModal.fecharInterno) {
        controladorModal.fecharInterno();
    }
}

//
//======================================================================
//  === PROVIDER GLOBAL DA MODAL =======================================
//  (ficará no topo da sua aplicação)
//======================================================================
//

export function ModalProvider({ children }) {
    // em vez de um único config, agora temos uma pilha de modais
    const [pilhaModais, setPilhaModais] = useState([]);

    // função interna que realmente abre a modal
    function abrirInterno(customConfig = {}) {

        // monta a config nova a partir do "default"
        const novaConfig = {
            abrir: true,
            tema: customConfig.tema !== undefined ? customConfig.tema : null,
            largura: customConfig.largura !== undefined ? customConfig.largura : null,
            fechar: customConfig.fechar !== undefined ? customConfig.fechar : true,
            linkFechar: customConfig.linkFechar !== undefined ? customConfig.linkFechar : null,
            automatico: customConfig.automatico !== undefined ? customConfig.automatico : 0,
            titulo: customConfig.titulo !== undefined ? customConfig.titulo : null,
            texto: customConfig.texto !== undefined ? customConfig.texto : null,
            novoComponente: customConfig.novoComponente !== undefined ? customConfig.novoComponente : null
        };

        // adiciona essa nova modal no topo da pilha
        setPilhaModais((pilhaAntiga) => pilhaAntiga.concat(novaConfig));
    }

    // função interna que fecha só a modal do topo
    function fecharInterno() {
        setPilhaModais((pilhaAntiga) => {
            if (pilhaAntiga.length === 0) {
                return pilhaAntiga;
            }
            return pilhaAntiga.slice(0, pilhaAntiga.length - 1);
        });
    }

    // registra as funções internas no controlador global (SINCRONO)
    controladorModal.abrirInterno = abrirInterno;
    controladorModal.fecharInterno = fecharInterno;

    // pega a modal do topo da pilha (ou usa configInicial se não tiver nenhuma)
    const modalAtual =
        pilhaModais.length > 0
            ? pilhaModais[pilhaModais.length - 1]
            : configInicial;

    return (
        <>
            {children}

            <ModalSalut
                abrir={modalAtual.abrir}
                onClose={fecharInterno}
                tema={modalAtual.tema}
                largura={modalAtual.largura}
                fechar={modalAtual.fechar}
                linkFechar={modalAtual.linkFechar}
                titulo={modalAtual.titulo}
                texto={modalAtual.texto}
                novoComponente={modalAtual.novoComponente}
            />
        </>
    );
}


export function ModalSalut({
    abrir,
    onClose,
    tema = null,
    largura = null,
    fechar = true,
    linkFechar = null,
    titulo = null,
    texto = null,
    novoComponente = null
}) {
    //trava scroll do body enquanto a modal estiver aberta
    useEffect(() => {
        if (abrir) {
            document.body.classList.add("travaScroll");
            return () => document.body.classList.remove("travaScroll");
        }
    }, [abrir]);

    // se a modal não deve abrir, nem mostra ela no DOM
    if (!abrir) return null;

    const handleClickFechar = function (e) {
        // se não tem linkFechar, o clique apenas fecha a modal
        if (!linkFechar) {
            e.preventDefault();
            if (onClose) onClose();
        }
    };

    // conteudo da modal
    const modalContent = (
        <div className={`modalSalut${tema ? " " + tema : ""} ON`}>
            <div className="modal-conteudo" style={{ maxWidth: largura || "600px" }}>
                {fechar && (
                    <a
                        href={linkFechar || "#fechar"}
                        className="btFecharModal"
                        onClick={handleClickFechar}
                    >
                        fechar
                    </a>
                )}

                <div className="headerModal">
                    {titulo && (
                        <div className="boxTitulo">
                            <h2>{titulo}</h2>
                        </div>
                    )}
                </div>

                <div className="conteudo">
                    {texto && (
                        <div className="tela">
                            <div className="moldura">
                                <p>{texto}</p>
                            </div>
                        </div>
                    )}

                    {novoComponente && novoComponente}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
