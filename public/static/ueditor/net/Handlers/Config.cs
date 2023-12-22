using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;
using F2.WorkflowEngine.Security.Utils;

/// <summary>
/// Config 的摘要说明
/// </summary>
public static class Config
{
    private static bool noCache = true;
	private static IDictionary<string, object> BuildItems()
    {
        var json = File.ReadAllText(HttpContext.Current.Server.MapPath("config.json"));
		IDictionary<string,object> dic= JsonHelper.DataRowFromJSON(json);
		return dic;
    }

	public static IDictionary<string, object> Items
    {
        get
        {
            if (noCache || _Items == null)
            {
                _Items = BuildItems();
            }
            return _Items;
        }
    }
	private static IDictionary<string, object> _Items;


    public static T GetValue<T>(string key)
    {
        return (T)Items[key];
    }

    public static String[] GetStringList(string key)
    {
		ArrayList value = Items[key] as ArrayList;
		string[] arrString = (string[])value.ToArray(typeof(string));
		return arrString;
    }

    public static String GetString(string key)
    {
        return GetValue<String>(key);
    }

    public static int GetInt(string key)
    {
        return GetValue<int>(key);
    }
}