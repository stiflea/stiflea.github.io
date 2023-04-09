package com.it.utils;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.Bucket;
import com.aliyun.oss.model.CannedAccessControlList;
import com.aliyun.oss.model.CreateBucketRequest;
import com.sun.deploy.util.SyncFileAccess;
import lombok.Data;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Data
public class OSSUtils {


    // endpoint是访问节点，外网访问节点，如果是阿里云服务器可以使用1内网访问
    // endpoint的格式形如“http://oss-cn-hangzhou.aliyuncs.com/”，注意http://后不带bucket名称，
    // 比如“http://bucket-name.oss-cn-hangzhou.aliyuncs.com”，是错误的endpoint，请去掉其中的“bucket-name”。
    private static String endpoint = "";

    // accessKeyId和accessKeySecret是OSS的访问密钥，您可以在控制台上创建和查看，
    // 注意：accessKeyId和accessKeySecret前后都没有空格，从控制台复制时请检查并去除多余的空格。
    private static String accessKeyId = "";
    private static String accessKeySecret = "";

    // Bucket用来管理所存储Object的仓库
    // Bucket命名规范如下：只能包括小写字母，数字和短横线（-），必须以小写字母或者数字开头，长度必须在3-63字节之间。
    private static String bucketName = "";
    //上传成功后返回URL http://仓库名.外网访问节点
    private static String SUFFRT_URL = "";
    private static String fileHost = "";

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");//格式化日期


    //    获取oss连接
    public static OSSClient getOSSClient() {
        //创建OSSClient
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
//        判断对象是否存在
        if (ossClient.doesBucketExist(bucketName)) {
            System.out.println("创建成功");
        } else {
            System.out.println("bucket不存在");
            CreateBucketRequest bucketRequest = new CreateBucketRequest(bucketName);
            bucketRequest.setCannedACL(CannedAccessControlList.PublicRead);//设置权限为公共读
            Bucket bucket = ossClient.createBucket(bucketRequest);//创建bucket
            System.out.println(bucket);
        }
        return ossClient;
    }

    /*
     * 上传文件
     *@param businessType 类型
     * */
    public static String upload(MultipartFile multipartFile) {
        //获取oss连接
        OSSClient ossClient = getOSSClient();
        //获取全称
        String originalFilename = multipartFile.getOriginalFilename();
        //后缀名称
        String s = originalFilename.substring(originalFilename.lastIndexOf("."));
        //组合FileName
        String fileName = getFileName(s);
        String url = null;
        //通过ossCLient上传文件获取返回的url
        try {
            ossClient.putObject(bucketName, fileName, new ByteArrayInputStream(multipartFile.getBytes()));
        } catch (IOException e) {
            System.out.println("上传失败！");
            e.printStackTrace();
        } finally {
            //关闭oss
            ossClient.shutdown();
        }
        return url = SUFFRT_URL+"/"+fileName;
    }

    private static String getFileName(String s) {
        //上传到哪个文件夹，不存在会创建一个
        String data = sdf.format(new Date());
        //为避免图片重名，使用UUID命名
        String uuid = UUID.randomUUID().toString().replace("-", "");
        //组合fileName
        String fileName = fileHost+"/"+data + "/" + uuid + s;
        return fileName;
    }
}
