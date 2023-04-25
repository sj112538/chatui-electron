# coding=utf-8 
import os
import time
import psutil as ps
limitation = os.getenv("SYSTEM") == "spaces"  # limit text and audio length in huggingface spaces
class Vits:
  hps_ms = None
  device = None
  @classmethod
  def get_disk_info(cls):
      disk_info = []
      for partition in ps.disk_partitions():
          partition_info = {
              '磁盘设备': partition.device,
              '挂载点': partition.mountpoint,
              '文件系统类型': partition.fstype,
              '选项': partition.opts,
              '类型': '磁盘',
              '路径': partition.mountpoint
          }
          try:
              partition_usage = ps.disk_usage(partition.mountpoint)
          except PermissionError:
              continue
          partition_info['总容量'] = f'{partition_usage.total / (1024 ** 3):.2f} GB'
          partition_info['已使用容量'] = f'{partition_usage.used / (1024 ** 3):.2f} GB'
          partition_info['可用容量'] = f'{partition_usage.free / (1024 ** 3):.2f} GB'
          partition_info['使用率'] = f'{partition_usage.percent}%'
          disk_info.append(partition_info)
      return {"data": disk_info, "status": 200, "msg": "获取成功"}
  @classmethod
  def getFiles(self, folder_path):
    try:
        result = {'数据': [], '状态': 200, '信息': ''}
        folder_path = os.path.normpath(folder_path)
        for name in os.listdir(folder_path):
            path = os.path.join(folder_path, name)
            if os.path.isdir(path):
                # 如果是文件夹，获取文件夹信息并添加到结果中
                stat = os.stat(path)
                dir_info = {
                    '名称': name,
                    '路径': path,
                    '大小': stat.st_size,
                    '创建时间': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_ctime)),
                    '修改时间': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime)),
                    '类型': '文件夹'
                }
                result['数据'].append(dir_info)
            else:
                # 如果是文件，获取文件信息并添加到结果中
                stat = os.stat(path)
                file_info = {
                    '名称': name,
                    '路径': path,
                    '大小': stat.st_size,
                    '创建时间': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_ctime)),
                    '修改时间': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime)),
                    '类型': '文件'
                }
                result['数据'].append(file_info)
        return {"data": result['数据'], "status": 200, "msg": "获取成功"}
    except Exception as e:
        return {"data": [], "status": 500, "msg": str(e)}
