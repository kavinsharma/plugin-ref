/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
(function(window, undefined)
{
	//custom class for creating interview
	function CInterview(arrQuestions, fOnEnd)
	{
		console.log("🚀 ~ file: code.js:22 ~ CInterview:")
		this.m_arrQuestions = [];
		this.m_nIndex       = 0;
		this.m_fOnEnd       = fOnEnd;

		this.private_Parse(arrQuestions);
		this.private_Init();
	}
	CInterview.prototype.private_Parse = function(arrQuestions)
	{
		console.log("🚀 ~ file: code.js:32 ~ private_Parse:")
		var nQuestionIndex = 0;
		for (var nIndex = 0, nCount = arrQuestions.length; nIndex < nCount; ++nIndex)
		{
			var sEncodedString = arrQuestions[nIndex].String;
			var arrSplit       = sEncodedString.split(";");

			if (arrSplit.length <= 1)
				continue;

			if ("q" === arrSplit[0])
			{
				this.m_arrQuestions[nQuestionIndex++] = {
					FieldId : arrQuestions[nIndex].FieldId,
					Type    : 0,
					String  : arrSplit[1],
					Answer  : ""
				};
				console.log("🚀 ~ file: code.js:46 ~ m_arrQuestions:",nIndex ,"dddd",this.m_arrQuestions)
			}
			else if ("d" === arrSplit[0])
			{
				this.m_arrQuestions[nQuestionIndex++] = {
					FieldId : arrQuestions[nIndex].FieldId,
					Type    : 1,
					String  : arrSplit[1],
					Items   : arrSplit.slice(2),
					Answer  : ""
				};
			}
		}
	};
	CInterview.prototype.private_Init = function()
	{
		console.log("🚀 ~ file: code.js:66 ~ private_Init:")
		document.getElementById("divSimpleQuestion").style.display = "none";
		document.getElementById("divDropDownQuestion").style.display = "none";

		var oThis = this;
		document.getElementById("buttonBack").onclick = function()
		{
			if (oThis.m_nIndex <= 0)
				return;

			oThis.m_nIndex--;
			oThis.Show();
			oThis.private_UpdateButtons();
		};

		document.getElementById("buttonNext").onclick = function()
		{
			console.log("🚀 ~ file: code.js:83 ~ buttonNext:")
			oThis.private_ProcessAnswer();

			if (oThis.m_nIndex === oThis.m_arrQuestions.length - 1)
				return oThis.m_fOnEnd(oThis.m_arrQuestions);
			else if (oThis.m_nIndex >= oThis.m_arrQuestions.length)
				return;

			oThis.m_nIndex++;
			oThis.Show();
			oThis.private_UpdateButtons();
		};

		this.private_UpdateButtons();
	};
	CInterview.prototype.private_ShowSimple = function(sQuestion)
	{
		console.log("🚀 ~ file: code.js:100 ~ private_ShowSimple:")
		document.getElementById("divSimpleQuestion").style.display   = "block";
		document.getElementById("divDropDownQuestion").style.display = "none";

		document.getElementById("divSimpleQuestionText").innerHTML = sQuestion;
		document.getElementById("inputSimpleQuestion").value       = "";
	};
	CInterview.prototype.private_ShowDropDown = function(sQuestion, arrItems)
	{
		console.log("🚀 ~ file: code.js:109 ~ private_ShowDropDown:")
		document.getElementById("divSimpleQuestion").style.display   = "none";
		document.getElementById("divDropDownQuestion").style.display = "block";

		document.getElementById("divDropDownQuestionText").innerHTML = sQuestion;

		var oSelect = document.getElementById("divDropDownQuestionSelect");
		while (oSelect.firstChild)
			oSelect.removeChild(oSelect.firstChild);

		for (var nIndex = 0, nCount = arrItems.length; nIndex < nCount; ++nIndex)
		{
			var oOption       = document.createElement("option");
			oOption.innerHTML = arrItems[nIndex];
			oSelect.appendChild(oOption);
		}
	};
	CInterview.prototype.private_UpdateButtons = function()
	{
		console.log("🚀 ~ file: code.js:128 ~ private_UpdateButtons:")
		if (this.m_nIndex <= 0)
			document.getElementById("buttonBack").style.display = "none";
		else
			document.getElementById("buttonBack").style.display = "block";

		if (this.m_nIndex >= this.m_arrQuestions.length)
			document.getElementById("buttonNext").style.display = "none";
		else
			document.getElementById("buttonNext").style.display = "block";
	};
	CInterview.prototype.private_ProcessAnswer = function()
	{
		console.log("🚀 ~ file: code.js:141 ~ private_ProcessAnswer:")
		if (!this.m_arrQuestions[this.m_nIndex])
			return;

		var oQuestion = this.m_arrQuestions[this.m_nIndex];
		if (0 === oQuestion.Type)
		{
			oQuestion.Answer = document.getElementById("inputSimpleQuestion").value;
		}
		else if (1 === oQuestion.Type)
		{
			var oSelect = document.getElementById("divDropDownQuestionSelect");
			var nSelectedIndex = oSelect.selectedIndex;
			var oOption = oSelect.childNodes[nSelectedIndex];
			if (!oOption)
				oQuestion.Answer = "";
			else
				oQuestion.Answer = oOption.innerHTML;
		}
	};
	CInterview.prototype.Show = function()
	{
		console.log("🚀 ~ file: code.js:163 ~ Show:",this.m_arrQuestions[this.m_nIndex])
		console.log("🚀 ~ file: code.js:163 ~ Show: index",this.m_nIndex)
		console.log("🚀 ~ file: code.js:163 ~ Show:array",JSON.stringify(this.m_arrQuestions))

		if (!this.m_arrQuestions[this.m_nIndex])
		{
			console.log("No questions found-----------------");
			window.Asc.plugin.executeCommand("close", "")
			return;
		}
			
		var oQuestion = this.m_arrQuestions[this.m_nIndex];
		if (0 === oQuestion.Type)
		{
			this.private_ShowSimple(oQuestion.String);
		}
		else if (1 === oQuestion.Type)
		{
			this.private_ShowDropDown(oQuestion.String, oQuestion.Items);
		}
	};

	var oInterview = null;
	var nState     = 0;
	var _Elements  = null;

	var _id = 0;
	function privateCreateScript(Label, Id)
	{
		console.log("🚀 ~ file: code.js:189 ~ privateCreateScript:")
		var _script = "\r\n\
		var oDocument = Api.GetDocument();\r\n\
		var oParagraph = Api.CreateParagraph();\r\n\
			var oRun = oParagraph.AddText(\'" + Label + "\');\r\n\
			oDocument.InsertContent([oParagraph], true);\r\n\
			";

		_script = _script.replaceAll("\r\n", "");
		_script = _script.replaceAll("\n", "");

		var _scriptObject = {
			"Props"  : {
				"Id"         : _id++,
				"Tag"        : "",
				"Lock"       : 0,
				"InternalId" : Id
			},
			"Script" : _script
		};

		return _scriptObject;
	}

	function privateCreateScriptForUnlocking(Id)
	{
		console.log("🚀 ~ file: code.js:215 ~ privateCreateScriptForUnlocking:")
		return {
			"Props"  : {
				"Lock"       : 3,
				"InternalId" : Id
			}
		};
	}

	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.replace(new RegExp(search, 'g'), replacement);
	};

	window.Asc.plugin.init = function()
	{
		//event "init" for plugin
		//execute method for getting all content controls
		window.Asc.plugin.executeMethod("GetAllContentControls");
	};

	window.Asc.plugin.onMethodReturn = function(returnValue)
	{
		//callback events for the methods "GetAllContentControls" and "InsertAndReplaceContentControls"
		var _plugin = window.Asc.plugin;
		if (_plugin.info.methodName == "GetAllContentControls")
		{
			console.log("🚀 ~ file: code.js:242 ~ GetAllContentControls:", JSON.stringify(returnValue));
			if (undefined === returnValue.length || returnValue.length <= 0)
			{
				console.log("No questions found");
				this.executeCommand("close", "");
			}
			else
			{
				var arrQuestions = [];
				for (var nIndex = 0, nCount = returnValue.length; nIndex < nCount; ++nIndex)
				{
					arrQuestions.push({String : returnValue[nIndex].Tag, FieldId : returnValue[nIndex].InternalId});
				}
				let temp = arrQuestions;
				console.log("🚀 ~ file: code.js:252 ~ arrQuestions:", JSON.stringify(temp))

				oInterview = new CInterview(arrQuestions, function(arrElements)
				{
					var _replace = [];
					for (var nIndex = 0, nCount = arrElements.length; nIndex < nCount; ++nIndex)
					{
						_replace.push(privateCreateScriptForUnlocking(arrElements[nIndex].FieldId));
					}
					console.log("🚀 ~ file: code.js:267 ~ _replace:", JSON.stringify(_replace))

					window.Asc.plugin.executeMethod("InsertAndReplaceContentControls", [_replace]);
					_Elements = arrElements;
				});
				oInterview.Show();
			}
		}
		else if (_plugin.info.methodName == "InsertAndReplaceContentControls")
		{
			console.log("🚀 ~ file: code.js:273 ~ InsertAndReplaceContentControls:",JSON.stringify(returnValue))
			if (0 === nState)
			{
				var _replace = [];
				
				for (var nIndex = 0, nCount = _Elements.length; nIndex < nCount; ++nIndex)
				{
					var nFieldId = _Elements[nIndex].FieldId;
					var sAnswer  = _Elements[nIndex].Answer;
					
					var _obj = privateCreateScript(sAnswer, nFieldId);
					_replace.push(_obj);
				}
				console.log("🚀 ~ file: code.js:278 ~ _replace:",JSON.stringify(_replace))

				window.Asc.plugin.executeMethod("InsertAndReplaceContentControls", [_replace]);
			}
			else if (1 === nState)
			{
				this.executeCommand("close", "");
			}
			nState++;
		}
	};

	window.Asc.plugin.button = function(id)
	{
		if (-1 === id)
		{
			this.executeCommand("close", "");
		}
	};

})(window, undefined);
