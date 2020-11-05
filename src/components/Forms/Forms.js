import React, {Fragment, useState, useEffect} from 'react'

const Forms = (props) => {
    const [checkedMulti, setCheckedMulti] = useState({})
    const [showDropdownMulti, setshowDropdownMulti] = useState({})
    const [inputs, setInputs] = useState([])

    const KeysValidation = {
        number: (e) => {
            console.log('e: ', e)
        }
    }

    const dropdown = (name) => {
        let dropDownAux = {...showDropdownMulti}
        dropDownAux[name] = !dropDownAux[name]
        setshowDropdownMulti(dropDownAux)
    }

    const toggleCheckbox = (name, option) => {

        let checks = JSON.parse(JSON.stringify(checkedMulti))
        let optionValue = {...option}
        delete optionValue.label
        delete optionValue.__typename
        console.log('optionValue: ', optionValue )
        console.log('checks[name]: ', checks[name])
        let index = checks[name] ? checks[name].findIndex(check => {
            console.log('check: ', check)
            console.log('option: ', option)
           return check.id === option.id}) : -1
        if(index >= 0) {
            checks[name][index].checked = !checks[name][index].checked  
        } else if(index === -1) {
            checks[name] = [optionValue]
        } else {
            checks[name].push(optionValue)
        }
        let formChecks = checks[name].filter(item => item.checked)  
        formChecks = JSON.parse(JSON.stringify(formChecks)).map( item => {
            delete item.label
            delete item.__typename
            delete item.checked
            return item
        })
        console.log('formChecks: ', formChecks)      
        setCheckedMulti(checks)
        props.onChange({name,value: formChecks})
    }

    useEffect(() => {
        if(!! props.inputs && props.inputs.some( item => item.type === 'select-multi')){
            let checks = {}
            props.inputs.forEach(input => {
                if(input.type === 'select-multi'){

                    checks[input.name] = JSON.parse(JSON.stringify(input.options))
                }
            })
            setCheckedMulti(checks)
        }
    },[])

    return <>
        {props.inputs && props.inputs.map( (input, index) => {
            let inputTag = null
            switch (input.type) {
                case 'select-multi': 
                    if (!input.options.length) {
                        break;
                    }
                    inputTag = <>
                        <div key={input.name + index} className="dropdown">
                            <button className="btn btn-light dropdown-toggle text-center" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" 
                                    aria-expanded="false" onClick={() => {dropdown(input.name)}} >{input.disabled? input.label : "Seleccione una opción"}</button>
                            <div className="dropdown-menu flex-column" aria-labelledby="dropdownMenu2" style={{display: showDropdownMulti[input.name] ? "flex" : "none"}}>
                                {input.options.map( (option, optionIndex) => (
                                    <label>
                                        <div className="dropdown-item pl-0 d-flex justify-content-between align-items-center" >
                                            {!input.disabled && <input className="col-2" type="checkbox" id={option.id} value={option.id} onChange={ () => toggleCheckbox(input.name, option)} checked={Object.keys(checkedMulti).length ? checkedMulti[input.name][optionIndex].checked : false}/> }
                                            <div className="col my-0 pr-4 text-left" for={option.id} >{option.label} </div>
                                        </div>
                                    </label>
                                    
                                ))}
                            </div>
                        </div>
                    </>
                    break;
                case 'text-area':
                    inputTag = <textarea key={input.name + index + !!input.disabled} onChange={(e) => {props.onChange(e.target)}} {...input} />
                    break;
                case 'number':
                    input = {... input,
                        type: 'text',
                        onKeyPress: KeysValidation.number
                    }
                    // input.type = 'text'
                    // input.pattern = "\\d*"
                    // input.onKeyPress = (e) => {KeysValidation.number(e)}
                default:
                    inputTag = <input key={input.name + index + !!input.disabled} onChange={(e) => {props.onChange(e.target)}} {...input} className={'col-12'} />
                    break;
            }

            if (!inputTag) return
            
            return(
                <div className={input.className}>
                    <label className="col-12 p-0"  >{input.label}</label>
                    {inputTag}
                </div>)
        })}
    </>
}

export default Forms