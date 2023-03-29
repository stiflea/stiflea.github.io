package cn.itcast.web.servlet;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;

/*
 * 文件下载
 *   获取文件名称
 *   使用字节输入流加载文件进入内存
 *   指定response的响应头，content-disposition:attachment;filename=xx
 *   将数据写出到response输出流
 *
 * */
@WebServlet("/downloadServlet")
public class DownLoadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Get");
        //1、获取请求参数
        String filename = req.getParameter("filename");
        //2、使用字节输入流进入内存
        //2.1找到服务器路径
        String realPath = this.getServletContext().getRealPath("/images/"+filename);
        //2.2字节流关联
        FileInputStream inputStream = new FileInputStream(realPath);
        //3、设置response响应头
        //3、1设置响应头类型，content-type
        String type = this.getServletContext().getMimeType("filename");//获取响应类型
        resp.setHeader("content-type",type);
/*        3、2设置响应头打开方式，
            附件形式 filename文件名字
            content-disposition:attachment,filename="+filename
          */
        resp.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(filename,"UTF-8"));
        //4、输入流的数据写入到输出流
        ServletOutputStream outputStream = resp.getOutputStream();
        byte[] buff = new byte[1024*8];
        int len = 0;
        while ((len = inputStream.read(buff)) !=-1){
            outputStream.write(buff,0,len);
        }
        inputStream.close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }
}
